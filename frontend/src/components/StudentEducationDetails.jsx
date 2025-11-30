// src/pages/StudentEducationDetails.jsx
import React, { useState } from "react";
import { API } from "./functions";

const pickData = (res) => (res?.data !== undefined ? res.data : res);

export default function StudentEducationDetails() {
  const [item, setItem] = useState(null);
  const [searchId, setSearchId] = useState("");

  const [createForm, setCreateForm] = useState({
    student_id: "",
    name: "",
    mark: "",
    start_year: "",
    end_year: "",
  });

  const [editForm, setEditForm] = useState({
    id: "",
    student_id: "",
    name: "",
    mark: "",
    start_year: "",
    end_year: "",
  });

  const getById = async () => {
    if (!searchId) return;
    const res = await fetch(`${API}/student-education/${searchId}`);
    const json = await res.json();
    setItem(pickData(json) || null);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await fetch(`${API}/create/student-education`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createForm),
    });
    setCreateForm({ student_id: "", name: "", mark: "", start_year: "", end_year: "" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await fetch(`${API}/update/update_Student_Education_Details`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setEditForm({ id: "", student_id: "", name: "", mark: "", start_year: "", end_year: "" });
  };

  const handleDelete = async () => {
    if (!item?.id) return;
    if (!window.confirm("Delete this record?")) return;
    await fetch(`${API}/student-education/${item.id}`, { method: "DELETE" });
    setItem(null);
    setSearchId("");
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Student Education Details</h2>

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
          <input
            placeholder="Student ID"
            value={createForm.student_id}
            onChange={(e) => setCreateForm({ ...createForm, student_id: e.target.value })}
          />
          <input
            placeholder="Name"
            value={createForm.name}
            onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
          />
          <input
            placeholder="Mark"
            value={createForm.mark}
            onChange={(e) => setCreateForm({ ...createForm, mark: e.target.value })}
          />
          <input
            placeholder="Start Year"
            value={createForm.start_year}
            onChange={(e) => setCreateForm({ ...createForm, start_year: e.target.value })}
          />
          <input
            placeholder="End Year"
            value={createForm.end_year}
            onChange={(e) => setCreateForm({ ...createForm, end_year: e.target.value })}
          />
          <button type="submit">Create</button>
        </form>
      </section>

      <section>
        <h3>Edit</h3>
        <form onSubmit={handleUpdate}>
          <input placeholder="ID" value={editForm.id} onChange={(e) => setEditForm({ ...editForm, id: e.target.value })} />
          <input
            placeholder="Student ID"
            value={editForm.student_id}
            onChange={(e) => setEditForm({ ...editForm, student_id: e.target.value })}
          />
          <input placeholder="Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
          <input placeholder="Mark" value={editForm.mark} onChange={(e) => setEditForm({ ...editForm, mark: e.target.value })} />
          <input
            placeholder="Start Year"
            value={editForm.start_year}
            onChange={(e) => setEditForm({ ...editForm, start_year: e.target.value })}
          />
          <input
            placeholder="End Year"
            value={editForm.end_year}
            onChange={(e) => setEditForm({ ...editForm, end_year: e.target.value })}
          />
          <button type="submit">Update</button>
        </form>
      </section>
    </div>
  );
}