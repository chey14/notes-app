
import { useEffect, useState } from "react";
import { getNotes, createNote, updateNote, deleteNote } from "./api";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadNotes() {
    try {
      setError("");
      setNotes(await getNotes());
    } catch {
      setError("Could not load notes. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setError("");

      if (editingId) {
        await updateNote(editingId, { title, content });
      } else {
        await createNote({ title, content });
      }

      setTitle("");
      setContent("");
      setEditingId(null);
      await loadNotes();
    } catch (err) {
      setError(err.message || "Could not save note");
    }
  }

  function handleEdit(note) {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  }

  async function handleDelete(id) {
    try {
      setError("");
      await deleteNote(id);
      await loadNotes();

      if (editingId === id) {
        setEditingId(null);
        setTitle("");
        setContent("");
      }
    } catch (err) {
      setError(err.message || "Could not delete note");
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setTitle("");
    setContent("");
  }

  return (
    <main className="container">
      <header>
        <p className="eyebrow">YOUR PERSONAL WORKSPACE</p>
        <h1>Notes App</h1>
        <p className="subtitle">Capture your thoughts. Keep things simple.</p>
      </header>

      <section className="editor">
        <h2>{editingId ? "Edit note" : "Create a note"}</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What is this note about?"
            required
          />

          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write something..."
            rows="4"
          />

          <div className="form-actions">
            <button type="submit">
              {editingId ? "Save changes" : "Add note"}
            </button>
            {editingId && (
              <button type="button" className="secondary" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="notes-section">
        <div className="section-heading">
          <h2>Your notes</h2>
          <span>{notes.length} total</span>
        </div>

        {error && <p className="error" role="alert">{error}</p>}
        {loading && <p>Loading notes...</p>}

        {!loading && notes.length === 0 && (
          <p className="empty">No notes yet. Create your first one above.</p>
        )}

        <div className="notes-grid">
          {notes.map((note) => (
            <article className="note-card" key={note.id}>
              <h3>{note.title}</h3>
              <p>{note.content || "No content"}</p>
              <div className="note-actions">
                <button className="secondary" onClick={() => handleEdit(note)}>
                  Edit
                </button>
                <button className="danger" onClick={() => handleDelete(note.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
