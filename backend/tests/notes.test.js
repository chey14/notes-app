
const { test, before, after, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../src/app");
const Note = require("../src/Note");

const TEST_DB_URI = "mongodb://127.0.0.1:27017/notesapp_test";

before(async () => {
  await mongoose.connect(TEST_DB_URI);
});

beforeEach(async () => {
  await Note.deleteMany({});
});

after(async () => {
  await Note.deleteMany({});
  await mongoose.disconnect();
});

test("health endpoint works", async () => {
  const response = await request(app).get("/health");

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { status: "ok" });
});

test("notes CRUD flow works", async () => {
  // Create
  const created = await request(app)
    .post("/api/notes")
    .send({
      title: "Learn Docker",
      content: "Build my first container",
    });

  assert.equal(created.status, 201);
  assert.equal(created.body.title, "Learn Docker");

  const id = created.body.id;

  // Read
  const list = await request(app).get("/api/notes");

  assert.equal(list.status, 200);
  assert.ok(list.body.some((note) => note.id === id));

  // Update
  const updated = await request(app)
    .put(`/api/notes/${id}`)
    .send({ title: "Learn Docker Compose" });

  assert.equal(updated.status, 200);
  assert.equal(updated.body.title, "Learn Docker Compose");

  // Delete
  const deleted = await request(app).delete(`/api/notes/${id}`);

  assert.equal(deleted.status, 200);

  // Verify deleted note cannot be updated
  const missing = await request(app)
    .put(`/api/notes/${id}`)
    .send({ title: "Updated title" });

  assert.equal(missing.status, 404);
});

test("rejects a note without a title", async () => {
  const response = await request(app)
    .post("/api/notes")
    .send({ content: "Missing title" });

  assert.equal(response.status, 400);
});

test("returns 404 when updating a nonexistent note", async () => {
  const id = new mongoose.Types.ObjectId().toString();

  const response = await request(app)
    .put(`/api/notes/${id}`)
    .send({ title: "Missing note" });

  assert.equal(response.status, 404);
});
