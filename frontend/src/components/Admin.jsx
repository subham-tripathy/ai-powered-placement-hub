import { useEffect, useRef, useState } from "react";
import { API, openSection, closeSection } from "./functions";
import { toast } from "react-toastify";

const pickData = (res) => (res?.data !== undefined ? res.data : res);

export default function Admin() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const [createForm, setCreateForm] = useState({
    email: "",
    name: "",
    phno: "",
    id: "",
    pw: "",
  });
  const [editForm, setEditForm] = useState({
    id: "",
    email: "",
    name: "",
    phno: "",
    pw: "",
  });

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admins`);
      const json = await res.json();
      if (Object.keys(json).length === 0) {
        setAdmins([]);
      } else {
        setAdmins(Array.isArray(json) ? json : pickData(json));
      }
    } catch (e) {
      console.error(e);
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await fetch(`${API}/create/admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createForm),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "success") {
          toast.success("New Admin Created!");
          setCreateForm({ email: "", name: "", phno: "", id: "", pw: "" });
          closeSection(createAdminSectionRef);
          return;
        }
        if (data.status == "error") {
          toast.error(data.message);
          return;
        }
      });
    loadAdmins();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await fetch(`${API}/update/admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "success") {
          toast.success("Admin Updated Successfully!");
          closeSection(editAdminSectionRef);
        }
      });
    setEditForm({ id: "", email: "", name: "", phno: "", pw: "" });
    setTimeout(() => {
      loadAdmins();
    }, 100);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete admin "${name}"?`)) return;
    await fetch(`${API}/admins/${id}`, { method: "DELETE" });
    toast.success("Admin deleted successfully!");
    loadAdmins();
  };

  const startEdit = (a) => {
    setEditForm({
      id: a.id,
      email: a.user?.email || "",
      name: a.name || "",
      phno: a.phoneNumber || "",
      pw: "",
    });
  };

  const createAdminSectionRef = useRef(null);
  const editAdminSectionRef = useRef(null);
  const viewAdminSectionRef = useRef(null);

  // Filter admins based on search
  const filteredAdmins = admins.filter(
    (a) =>
      a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.phoneNumber?.includes(searchTerm)
  );

  // Generate avatar color based on name
  const getAvatarColor = (name) => {
    const colors = [
      "from-red-500 to-pink-500",
      "from-orange-500 to-amber-500",
      "from-yellow-500 to-lime-500",
      "from-green-500 to-emerald-500",
      "from-teal-500 to-cyan-500",
      "from-blue-500 to-indigo-500",
      "from-violet-500 to-purple-500",
      "from-fuchsia-500 to-pink-500",
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            👨‍💼 TnP Admin Management
          </h1>
          <p className="text-emerald-300 text-lg">
            Manage Training & Placement administrators
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/10 hover:border-emerald-500/50 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                👥
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{admins.length}</div>
                <div className="text-emerald-300 text-sm">Total Admins</div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/10 hover:border-blue-500/50 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                ✅
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400">{admins.length}</div>
                <div className="text-blue-300 text-sm">Active</div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/10 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                🎯
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400">24/7</div>
                <div className="text-purple-300 text-sm">Availability</div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/10 hover:border-amber-500/50 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                🏆
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-400">100%</div>
                <div className="text-amber-300 text-sm">Verified</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-white/10">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="w-full md:w-96 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-lg">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search by name, email, ID, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => openSection(createAdminSectionRef)}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-[1.02] flex items-center gap-2"
              >
                <span className="text-lg">➕</span>
                Add New Admin
              </button>
              <button
                onClick={loadAdmins}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                <span className={`text-lg ${loading ? "animate-spin" : ""}`}>🔄</span>
                Refresh
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-3 text-white/60 text-sm">
            Showing {filteredAdmins.length} of {admins.length} administrators
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mb-4"></div>
            <p className="text-white/60">Loading administrators...</p>
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Admins Found</h3>
            <p className="text-white/60 mb-6">
              {searchTerm
                ? "Try adjusting your search criteria"
                : "Get started by adding your first administrator"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => openSection(createAdminSectionRef)}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg transition-all"
              >
                ➕ Add First Admin
              </button>
            )}
          </div>
        ) : (
          /* Admin Cards Grid */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAdmins.map((a) => (
              <div
                key={a.id}
                className="group bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 hover:transform hover:scale-[1.02]"
              >
                {/* Card Header */}
                <div className={`h-24 bg-gradient-to-r ${getAvatarColor(a.name)} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full"></div>
                  <div className="absolute -top-6 -left-6 w-20 h-20 bg-white/10 rounded-full"></div>
                  
                  {/* Admin Badge */}
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Active
                  </div>
                </div>

                {/* Avatar */}
                <div className="relative px-6">
                  <div className={`absolute -top-10 left-6 w-20 h-20 bg-gradient-to-r ${getAvatarColor(a.name)} rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl border-4 border-slate-800`}>
                    {a.name?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                </div>

                <div className="pt-14 px-6 pb-6">
                  {/* Name and ID */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {a.name}
                    </h3>
                    <p className="text-emerald-400 text-sm font-mono">ID: {a.id}</p>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-3 text-white/70">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-sm">
                        📧
                      </div>
                      <span className="text-sm truncate">{a.user?.email || "No email"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/70">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-sm">
                        📱
                      </div>
                      <span className="text-sm">{a.phoneNumber || "No phone"}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-white/10">
                    <button
                      onClick={() => {
                        setSelectedAdmin(a);
                        openSection(viewAdminSectionRef);
                      }}
                      className="flex-1 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                    >
                      👁️ View
                    </button>
                    <button
                      onClick={() => {
                        startEdit(a);
                        openSection(editAdminSectionRef);
                      }}
                      className="flex-1 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(a.id, a.name)}
                      className="py-2.5 px-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-medium transition-all"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table View Toggle (Alternative View) */}
        {filteredAdmins.length > 0 && (
          <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                📋 Quick Overview Table
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5">
                    <th className="px-6 py-4 text-left text-emerald-300 font-semibold text-sm">Admin</th>
                    <th className="px-6 py-4 text-left text-emerald-300 font-semibold text-sm">Email</th>
                    <th className="px-6 py-4 text-left text-emerald-300 font-semibold text-sm">Phone</th>
                    <th className="px-6 py-4 text-left text-emerald-300 font-semibold text-sm">Status</th>
                    <th className="px-6 py-4 text-right text-emerald-300 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredAdmins.map((a) => (
                    <tr key={a.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 bg-gradient-to-r ${getAvatarColor(a.name)} rounded-xl flex items-center justify-center text-white font-bold`}>
                            {a.name?.charAt(0)?.toUpperCase() || "A"}
                          </div>
                          <div>
                            <div className="text-white font-medium">{a.name}</div>
                            <div className="text-white/50 text-xs font-mono">{a.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/70">{a.user?.email}</td>
                      <td className="px-6 py-4 text-white/70">{a.phoneNumber || "-"}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              startEdit(a);
                              openSection(editAdminSectionRef);
                            }}
                            className="p-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg transition-all"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(a.id, a.name)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create Admin Modal */}
      <div
        ref={createAdminSectionRef}
        className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 scale-0 transition-transform duration-300"
      >
        <div className="w-[90%] max-w-lg bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-white/20 shadow-2xl overflow-hidden animate-fadeIn">
          {/* Modal Header */}
          <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                ➕
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Create New Admin</h3>
                <p className="text-emerald-300 text-sm">Add a new TnP administrator</p>
              </div>
            </div>
          </div>

          {/* Modal Form */}
          <form onSubmit={handleCreate} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-emerald-300 text-sm font-medium mb-2">
                  Admin ID *
                </label>
                <input
                  required
                  placeholder="e.g., ADM001"
                  value={createForm.id}
                  onChange={(e) => setCreateForm({ ...createForm, id: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-emerald-300 text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  required
                  placeholder="Enter full name"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-emerald-300 text-sm font-medium mb-2">
                Email Address *
              </label>
              <input
                required
                type="email"
                placeholder="admin@example.com"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-emerald-300 text-sm font-medium mb-2">
                  Phone Number *
                </label>
                <input
                  required
                  placeholder="+91 XXXXX XXXXX"
                  value={createForm.phno}
                  onChange={(e) => setCreateForm({ ...createForm, phno: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-emerald-300 text-sm font-medium mb-2">
                  Password *
                </label>
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={createForm.pw}
                  onChange={(e) => setCreateForm({ ...createForm, pw: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-[1.02]"
              >
                ✨ Create Admin
              </button>
              <button
                type="button"
                onClick={() => closeSection(createAdminSectionRef)}
                className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Edit Admin Modal */}
      <div
        ref={editAdminSectionRef}
        className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 scale-0 transition-transform duration-300"
      >
        <div className="w-[90%] max-w-lg bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          {/* Modal Header */}
          <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500"></div>
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                ✏️
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Edit Admin</h3>
                <p className="text-amber-300 text-sm">Update administrator details</p>
              </div>
            </div>
          </div>

          {/* Modal Form */}
          <form onSubmit={handleUpdate} className="p-6 space-y-4">
            {/* ID Display */}
            <div className="bg-amber-500/20 rounded-xl p-3 border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="text-amber-300 text-sm">Admin ID: </span>
                <span className="text-white font-mono font-bold">{editForm.id}</span>
              </div>
              <span className="text-amber-400 text-xs bg-amber-500/20 px-2 py-1 rounded-lg">Read-only</span>
            </div>

            <div>
              <label className="block text-amber-300 text-sm font-medium mb-2">
                Full Name *
              </label>
              <input
                required
                placeholder="Enter full name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-amber-300 text-sm font-medium mb-2">
                Email Address *
              </label>
              <input
                required
                type="email"
                placeholder="admin@example.com"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-amber-300 text-sm font-medium mb-2">
                  Phone Number *
                </label>
                <input
                  required
                  placeholder="+91 XXXXX XXXXX"
                  value={editForm.phno}
                  onChange={(e) => setEditForm({ ...editForm, phno: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-amber-300 text-sm font-medium mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Leave blank to keep"
                  value={editForm.pw}
                  onChange={(e) => setEditForm({ ...editForm, pw: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-[1.02]"
              >
                💾 Update Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  closeSection(editAdminSectionRef);
                  setEditForm({ id: "", email: "", name: "", phno: "", pw: "" });
                }}
                className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* View Admin Modal */}
      <div
        ref={viewAdminSectionRef}
        className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 scale-0 transition-transform duration-300"
      >
        {selectedAdmin && (
          <div className="w-[90%] max-w-lg bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
            {/* Modal Header with Gradient */}
            <div className={`h-32 bg-gradient-to-r ${getAvatarColor(selectedAdmin.name)} relative`}>
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full"></div>
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-white/10 rounded-full"></div>
              
              {/* Close Button */}
              <button
                onClick={() => {
                  closeSection(viewAdminSectionRef);
                  setSelectedAdmin(null);
                }}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all"
              >
                ✕
              </button>
            </div>

            {/* Avatar */}
            <div className="relative px-6">
              <div className={`absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-r ${getAvatarColor(selectedAdmin.name)} rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-slate-800`}>
                {selectedAdmin.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
            </div>

            <div className="pt-16 px-6 pb-6">
              {/* Name and Status */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-1">{selectedAdmin.name}</h3>
                <p className="text-emerald-400 font-mono text-sm">ID: {selectedAdmin.id}</p>
                <span className="inline-flex items-center gap-1.5 bg-green-500/20 text-green-400 px-4 py-1.5 rounded-full text-sm font-medium mt-3">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Active Administrator
                </span>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-lg">
                      📧
                    </div>
                    <div>
                      <div className="text-white/50 text-xs">Email Address</div>
                      <div className="text-white font-medium">{selectedAdmin.user?.email}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center text-lg">
                      📱
                    </div>
                    <div>
                      <div className="text-white/50 text-xs">Phone Number</div>
                      <div className="text-white font-medium">{selectedAdmin.phoneNumber || "Not provided"}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center text-lg">
                      🔐
                    </div>
                    <div>
                      <div className="text-white/50 text-xs">Role</div>
                      <div className="text-white font-medium">TnP Administrator</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    closeSection(viewAdminSectionRef);
                    startEdit(selectedAdmin);
                    openSection(editAdminSectionRef);
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  ✏️ Edit Admin
                </button>
                <button
                  onClick={() => {
                    closeSection(viewAdminSectionRef);
                    setSelectedAdmin(null);
                  }}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}