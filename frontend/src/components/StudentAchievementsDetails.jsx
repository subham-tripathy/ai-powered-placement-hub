// src/pages/StudentAchievementsDetails.jsx
import React, { useState } from "react";

const pickData = (res) => (res?.data !== undefined ? res.data : res);

export default function StudentAchievementsDetails() {
  const [item, setItem] = useState(null);
  const [searchId, setSearchId] = useState("");

  const [createForm, setCreateForm] = useState({
    student_id: "",
    title: "",
    description: "",
    date: "",
    certificate: "",
    status: "",
  });

  const [editForm, setEditForm] = useState({
    id: "",
    student_id: "",
    title: "",
    description: "",
    date: "",
    certificate: "",
    status: "",
  });

  const getById = async () => {
    if (!searchId) return;
    const res = await fetch(`${API}/student-achievements/${searchId}`);
    const json = await res.json();
    setItem(pickData(json) || null);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await fetch(`${API}/create/student-achievement`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createForm),
    });
    setCreateForm({ student_id: "", title: "", description: "", date: "", certificate: "", status: "" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await fetch(`${API}/update/update_Student_Achievements_Details`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setEditForm({ id: "", student_id: "", title: "", description: "", date: "", certificate: "", status: "" });
  };

  const handleDelete = async () => {
    if (!item?.id) return;
    if (!window.confirm("Delete this record?")) return;
    await fetch(`${API}/student-achievements/${item.id}`, { method: "DELETE" });
    setItem(null);
    setSearchId("");
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Student Achievements Details</h2>

      <section style={{ marginBottom: 24 }}>
        <h3>Find by ID</h3>
        <input placeholder="ID" value={searchId} onChange={(e) => setSearchId(e.target.value)} />
        <button onClick={getById}>Get</button>
        {item && (
          <div style={{ marginTop: 12 }}>
            <code>{JSON.stringify(item, null, 2)}</code>
            <div style={{ marginTop: 8 }}>
              <button onClick={handleDelete} style={{ color: "red" }}>
                Delete
              </button>
            </div>
          </div>
        )}
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3>Create</h3>
        <form onSubmit={handleCreate}>
          <input placeholder="Student ID" value={createForm.student_id} onChange={(e) => setCreateForm({ ...createForm, student_id: e.target.value })} />
          <input placeholder="Title" value={createForm.title} onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })} />
          <input placeholder="Description" value={createForm.description} onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })} />
          <input type="date" placeholder="Date" value={createForm.date} onChange={(e) => setCreateForm({ ...createForm, date: e.target.value })} />
          <input placeholder="Certificate URL" value={createForm.certificate} onChange={(e) => setCreateForm({ ...createForm, certificate: e.target.value })} />
          <input placeholder="Status" value={createForm.status} onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })} />
          <button type="submit">Create</button>
        </form>
      </section>

      <section>
        <h3>Edit</h3>
        <form onSubmit={handleUpdate}>
          <input placeholder="ID" value={editForm.id} onChange={(e) => setEditForm({ ...editForm, id: e.target.value })} />
          <input placeholder="Student ID" value={editForm.student_id} onChange={(e) => setEditForm({ ...editForm, student_id: e.target.value })} />
          <input placeholder="Title" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
          <input placeholder="Description" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
          <input type="date" placeholder="Date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} />
          <input placeholder="Certificate URL" value={editForm.certificate} onChange={(e) => setEditForm({ ...editForm, certificate: e.target.value })} />
          <input placeholder="Status" value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} />
          <button type="submit">Update</button>
        </form>
      </section>
    </div>
  );
}