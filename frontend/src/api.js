
const API_URL = "http://localhost:3000/api/notes";

export async function getNotes() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Failed to fetch notes");
  return response.json();
}

export async function createNote(note) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create note");
  }

  return response.json();
}

export async function updateNote(id, note) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });

  if (!response.ok) throw new Error("Failed to update note");
  return response.json();
}

export async function deleteNote(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete note");
}
