
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Note = require("./Note");

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Get all notes
app.get("/api/notes", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.status(200).json(
      notes.map((note) => ({
        id: note._id.toString(),
        title: note.title,
        content: note.content,
      }))
    );
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// Create a note
app.post("/api/notes", async (req, res) => {
  try {
    const { title, content = "" } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (typeof content !== "string") {
      return res.status(400).json({ error: "Content must be a string" });
    }

    const note = await Note.create({
      title: title.trim(),
      content,
    });

    res.status(201).json({
      id: note._id.toString(),
      title: note.title,
      content: note.content,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create note" });
  }
});

// Update a note
app.put("/api/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid note ID" });
    }

    const { title, content } = req.body;
    const updates = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ error: "Title cannot be empty" });
      }
      updates.title = title.trim();
    }

    if (content !== undefined) {
      if (typeof content !== "string") {
        return res.status(400).json({ error: "Content must be a string" });
      }
      updates.content = content;
    }

    const note = await Note.findByIdAndUpdate(id, updates, {
        returnDocument: "after",
        runValidators: true,
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json({
      id: note._id.toString(),
      title: note.title,
      content: note.content,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update note" });
  }
});

// Delete a note
app.delete("/api/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid note ID" });
    }

    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete note" });
  }
});

module.exports = app;
