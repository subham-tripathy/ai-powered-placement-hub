import { useState } from "react";

const pickData = (res) => (res?.data !== undefined ? res.data : res);

export default function PlacementDetails() {
  const [item, setItem] = useState(null);
  const [searchId, setSearchId] = useState("");

  const [createForm, setCreateForm] = useState({
    drive_id: "",
    company_id: "",
    applied_students: "",
    shortlisted_students: "",
    selected_students: "",
  });

  const [editForm, setEditForm] = useState({
    id: "",
    drive_id: "",
    company_id: "",
    applied_students: "",
    shortlisted_students: "", // UI uses the correct spelling
    selected_students: "",
  });

  const getById = async () => {
    if (!searchId) return;
    const res = await fetch(`${API}/placements/${searchId}`);
    const json = await res.json();
    setItem(pickData(json) || null);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    // Server create route supports either 'shortlisted_students' or legacy 'shortlisted_studends'
    await fetch(`${API}/create/placement`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createForm),
    });
    setCreateForm({
      drive_id: "",
      company_id: "",
      applied_students: "",
      shortlisted_students: "",
      selected_students: "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    // Existing update route expects 'shortlisted_studends' (legacy typo)
    const body = {
      id: editForm.id,
      drive_id: editForm.drive_id,
      company_id: editForm.company_id,
      applied_students: editForm.applied_students,
      shortlisted_studends: editForm.shortlisted_students,
      selected_students: editForm.selected_students,
    };
    await fetch(`${API}/update/update_Placement_Details`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setEditForm({
      id: "",
      drive_id: "",
      company_id: "",
      applied_students: "",
      shortlisted_students: "",
      selected_students: "",
    });
  };

  const handleDelete = async () => {
    if (!item?.id) return;
    if (!window.confirm("Delete this record?")) return;
    await fetch(`${API}/placements/${item.id}`, { method: "DELETE" });
    setItem(null);
    setSearchId("");
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Placement Details</h2>

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
          <input placeholder="Drive ID" value={createForm.drive_id} onChange={(e) => setCreateForm({ ...createForm, drive_id: e.target.value })} />
          <input placeholder="Company ID" value={createForm.company_id} onChange={(e) => setCreateForm({ ...createForm, company_id: e.target.value })} />
          <input placeholder="Applied Students" value={createForm.applied_students} onChange={(e) => setCreateForm({ ...createForm, applied_students: e.target.value })} />
          <input placeholder="Shortlisted Students" value={createForm.shortlisted_students} onChange={(e) => setCreateForm({ ...createForm, shortlisted_students: e.target.value })} />
          <input placeholder="Selected Students" value={createForm.selected_students} onChange={(e) => setCreateForm({ ...createForm, selected_students: e.target.value })} />
          <button type="submit">Create</button>
        </form>
      </section>

      <section>
        <h3>Edit</h3>
        <form onSubmit={handleUpdate}>
          <input placeholder="ID" value={editForm.id} onChange={(e) => setEditForm({ ...editForm, id: e.target.value })} />
          <input placeholder="Drive ID" value={editForm.drive_id} onChange={(e) => setEditForm({ ...editForm, drive_id: e.target.value })} />
          <input placeholder="Company ID" value={editForm.company_id} onChange={(e) => setEditForm({ ...editForm, company_id: e.target.value })} />
          <input placeholder="Applied Students" value={editForm.applied_students} onChange={(e) => setEditForm({ ...editForm, applied_students: e.target.value })} />
          <input placeholder="Shortlisted Students" value={editForm.shortlisted_students} onChange={(e) => setEditForm({ ...editForm, shortlisted_students: e.target.value })} />
          <input placeholder="Selected Students" value={editForm.selected_students} onChange={(e) => setEditForm({ ...editForm, selected_students: e.target.value })} />
          <button type="submit">Update</button>
        </form>
      </section>
    </div>
  );
}