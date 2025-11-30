import { useState } from "react";

const pickData = (res) => (res?.data !== undefined ? res.data : res);

export default function StudentInternshipDetails() {
  const [item, setItem] = useState(null);
  const [searchId, setSearchId] = useState("");

  const [createForm, setCreateForm] = useState({
    student_id: "",
    name: "",
    company_name: "",
    role: "",
    start_date: "",
    end_date: "",
    certificate: "",
  });

  const [editForm, setEditForm] = useState({
    id: "",
    student_id: "",
    name: "",
    company_name: "",
    role: "",
    start_date: "",
    end_date: "",
    certificate: "",
  });

  const getById = async () => {
    if (!searchId) return;
    const res = await fetch(`${API}/student-internships/${searchId}`);
    const json = await res.json();
    setItem(pickData(json) || null);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await fetch(`${API}/create/student-internship`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createForm),
    });
    setCreateForm({ student_id: "", name: "", company_name: "", role: "", start_date: "", end_date: "", certificate: "" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await fetch(`${API}/update/update_Student_Internship_Details`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setEditForm({ id: "", student_id: "", name: "", company_name: "", role: "", start_date: "", end_date: "", certificate: "" });
  };

  const handleDelete = async () => {
    if (!item?.id) return;
    if (!window.confirm("Delete this record?")) return;
    await fetch(`${API}/student-internships/${item.id}`, { method: "DELETE" });
    setItem(null);
    setSearchId("");
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Student Internship Details</h2>

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
          <input placeholder="Internship Name" value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} />
          <input placeholder="Company Name" value={createForm.company_name} onChange={(e) => setCreateForm({ ...createForm, company_name: e.target.value })} />
          <input placeholder="Role" value={createForm.role} onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })} />
          <input type="date" placeholder="Start Date" value={createForm.start_date} onChange={(e) => setCreateForm({ ...createForm, start_date: e.target.value })} />
          <input type="date" placeholder="End Date" value={createForm.end_date} onChange={(e) => setCreateForm({ ...createForm, end_date: e.target.value })} />
          <input placeholder="Certificate URL" value={createForm.certificate} onChange={(e) => setCreateForm({ ...createForm, certificate: e.target.value })} />
          <button type="submit">Create</button>
        </form>
      </section>

      <section>
        <h3>Edit</h3>
        <form onSubmit={handleUpdate}>
          <input placeholder="ID" value={editForm.id} onChange={(e) => setEditForm({ ...editForm, id: e.target.value })} />
          <input placeholder="Student ID" value={editForm.student_id} onChange={(e) => setEditForm({ ...editForm, student_id: e.target.value })} />
          <input placeholder="Internship Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
          <input placeholder="Company Name" value={editForm.company_name} onChange={(e) => setEditForm({ ...editForm, company_name: e.target.value })} />
          <input placeholder="Role" value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} />
          <input type="date" placeholder="Start Date" value={editForm.start_date} onChange={(e) => setEditForm({ ...editForm, start_date: e.target.value })} />
          <input type="date" placeholder="End Date" value={editForm.end_date} onChange={(e) => setEditForm({ ...editForm, end_date: e.target.value })} />
          <input placeholder="Certificate URL" value={editForm.certificate} onChange={(e) => setEditForm({ ...editForm, certificate: e.target.value })} />
          <button type="submit">Update</button>
        </form>
      </section>
    </div>
  );
}