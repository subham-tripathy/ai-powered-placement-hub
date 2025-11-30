import { useEffect, useState } from "react";
import { API, dangerBtnStyle, formInputStyle, formStyle, headerStyle, primaryBtnStyle, tableStyle, tdStyle, thStyle } from "./functions";
import { toast } from "react-toastify";
const pickData = (res) => (res?.data !== undefined ? res.data : res);

export default function Company() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [createForm, setCreateForm] = useState({
    id: "",
    name: "",
    type: "",
    email: "",
    hrName: "",
    website: "",
    pw: "",
  });

  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    type: "",
    email: "",
    hrName: "",
    website: "",
    pw: "",
  });

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/companies`);
      const json = await res.json();
      if (json.status == "success") {
        if (Object.keys(json.data).length === 0) {
          setCompanies([]);
        } else {
          setCompanies(Array.isArray(json.data) ? json.data : pickData(json));
        }
      }
      if (json.status == "error") {
        setCompanies([]);
      }
    } catch (e) {
      // console.error(e);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/create/company`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createForm),
    });
    await res.json().then((data) => {
      console.log(data);
      if (data.status == "success") {
        toast.success("Company created successfully !");
      }
    });
    setCreateForm({
      id: "",
      name: "",
      type: "",
      email: "",
      hrName: "",
      website: "",
      pw: "",
    });
    loadCompanies();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/update/company`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    await res.json();
    setEditForm({
      id: "",
      name: "",
      type: "",
      email: "",
      hrName: "",
      website: "",
      pw: "",
    });
    loadCompanies();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this company?")) return;
    await fetch(`${API}/companies/${id}`, { method: "DELETE" });
    loadCompanies();
  };

  const startEdit = (c) => {
    setEditForm({
      id: c.id,
      name: c.companyName || "",
      email: c.user.email || "",
      type: c.companyType || "",
      hrName: c.hrName || "",
      website: c.websiteUrl || "",
      pw: c.pw || "",
    });
  };

  return (
    <div style={{ padding: 16 }}>
      <h2 className={headerStyle}>Company CRUD</h2>

      <section style={{ marginBottom: 24 }}>
        <form className={formStyle} onSubmit={handleCreate}>
          <h3 className={headerStyle}>Create Company</h3>
          <input
            className={formInputStyle}
            required
            name="id"
            placeholder="ID"
            value={createForm.id}
            onChange={(e) =>
              setCreateForm({ ...createForm, id: e.target.value })
            }
          />
          <input
            className={formInputStyle}
            required
            name="name"
            placeholder="Name"
            value={createForm.name}
            onChange={(e) =>
              setCreateForm({ ...createForm, name: e.target.value })
            }
          />
          <input
            className={formInputStyle}
            required
            name="type"
            placeholder="Type"
            value={createForm.type}
            onChange={(e) =>
              setCreateForm({ ...createForm, type: e.target.value })
            }
          />
          <input
            className={formInputStyle}
            required
            name="email"
            placeholder="Email"
            value={createForm.email}
            onChange={(e) =>
              setCreateForm({ ...createForm, email: e.target.value })
            }
          />
          <input
            className={formInputStyle}
            required
            name="hrName"
            placeholder="HR Name"
            value={createForm.hrName}
            onChange={(e) =>
              setCreateForm({ ...createForm, hrName: e.target.value })
            }
          />
          <input
            className={formInputStyle}
            required
            name="website"
            placeholder="Website"
            value={createForm.website}
            onChange={(e) =>
              setCreateForm({ ...createForm, website: e.target.value })
            }
          />
          <input
            className={formInputStyle}
            required
            type="password"
            name="pw"
            placeholder="Password"
            value={createForm.pw}
            onChange={(e) =>
              setCreateForm({ ...createForm, pw: e.target.value })
            }
          />
          <button className={primaryBtnStyle} type="submit">Create</button>
        </form>
      </section>

      <section style={{ marginBottom: 24 }}>
        <form className={formStyle} onSubmit={handleUpdate}>
          <h3 className={headerStyle}>Edit Company</h3>
          <input
            className={formInputStyle}
            required
            name="id"
            placeholder="ID"
            value={editForm.id}
            onChange={(e) => setEditForm({ ...editForm, id: e.target.value })}
            readOnly
          />
          <input
            className={formInputStyle}
            required
            name="name"
            placeholder="Name"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          />
          <input
            className={formInputStyle}
            required
            name="type"
            placeholder="Type"
            value={editForm.type}
            onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
          />
          <input
            className={formInputStyle}
            required
            name="email"
            placeholder="Email"
            value={editForm.email}
            onChange={(e) =>
              setEditForm({ ...createForm, email: e.target.value })
            }
          />
          <input
            className={formInputStyle}
            required
            name="hrName"
            placeholder="HR Name"
            value={editForm.hrName}
            onChange={(e) =>
              setEditForm({ ...editForm, hrName: e.target.value })
            }
          />
          <input
            className={formInputStyle}
            required
            name="website"
            placeholder="Website"
            value={editForm.website}
            onChange={(e) =>
              setEditForm({ ...editForm, website: e.target.value })
            }
          />
          <input
            className={formInputStyle}
            required
            type="password"
            name="pw"
            placeholder="Password"
            value={editForm.pw}
            onChange={(e) => setEditForm({ ...editForm, pw: e.target.value })}
          />
          <button className={primaryBtnStyle} type="submit">Update</button>
        </form>
      </section>

      <section>
        <h3 className={headerStyle}>Companies {loading ? "(loading...)" : ""}</h3>
        <table className={tableStyle}>
          <thead className="bg-[#9ED5C8] dark:bg-[#303030]">
            <tr>
              <th className={thStyle}>ID</th>
              <th className={thStyle}>Company Name</th>
              <th className={thStyle}>Company Type</th>
              <th className={thStyle}>Company HR</th>
              <th className={thStyle}>Company Website</th>
              <th className={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody className="bg-[#F0FDFB] dark:bg-[#505050]">

            {(companies || []).map((c) => (
              <tr key={c.id}>
                <td className={tdStyle}>{c.id} </td>
                <td className={tdStyle}>{c.companyName} </td>
                <td className={tdStyle}>{c.companyType} </td>
                <td className={tdStyle}>{c.hrName} </td>
                <td className={tdStyle}>{c.websiteUrl}</td>
                <td className={tdStyle + " flex gap-3"}>
                  <button className={primaryBtnStyle} onClick={() => startEdit(c)}>Edit</button>
                  <button className={dangerBtnStyle} onClick={() => handleDelete(c.id)} >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div >
  );
}
