import { useContext, useEffect, useRef, useState } from "react";
import { API, ApplyForJob, closeSection, openSection, showAppliedStudents, showSelectedStudents, showShortlistedStudents } from "./functions";
import { LoginContext } from "./ContextProvider";
import { jwtDecode } from "jwt-decode";

const pickData = (res) => (res?.data !== undefined ? res.data : res);

const initialCreateForm = {
  tnpAdminId: "",
  driveTitle: "",
  startDate: "",
  endDate: "",
  status: "upcoming",
  jobIds: [],
};

const initialEditForm = {
  id: "",
  tnpAdminId: "",
  driveTitle: "",
  startDate: "",
  endDate: "",
  status: "",
  jobIds: [],
};

export default function Drive() {
  const studentListRef = useRef(null);
  const studentDetailsRef = useRef(null);
  const { user } = useContext(LoginContext);
  const [usr, setusr] = useState(null);
  const [activeTab, setActiveTab] = useState("list"); // 'list', 'create', 'edit'
  
  useEffect(() => {
    if (user) {
      setusr(jwtDecode(user));
    }
  }, [user]);

  const [drives, setDrives] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [createForm, setCreateForm] = useState(initialCreateForm);
  const [editForm, setEditForm] = useState(initialEditForm);

  const loadDrives = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/drives`);
      const json = await res.json();
      setDrives(pickData(json) || []);
    } catch (e) {
      console.error(e);
      setDrives([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAdmins = async () => {
    try {
      const res = await fetch(`${API}/admins`);
      const json = await res.json();
      setAdmins(pickData(json) || []);
    } catch (e) {
      console.error(e);
      setAdmins([]);
    }
  };

  const loadJobs = async () => {
    try {
      const res = await fetch(`${API}/jobs`);
      const json = await res.json();
      setJobs(pickData(json) || []);
    } catch (e) {
      console.error(e);
      setJobs([]);
    }
  };

  useEffect(() => {
    loadDrives();
    loadAdmins();
    loadJobs();
  }, []);

  const handleCreateChange = (e) => {
    const { name, value, options } = e.target;
    if (name === "jobIds") {
      const selectedIds = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => parseInt(option.value));
      setCreateForm({ ...createForm, [name]: selectedIds });
    } else {
      setCreateForm({ ...createForm, [name]: value });
    }
  };

  const handleEditChange = (e) => {
    const { name, value, options } = e.target;
    if (name === "jobIds") {
      const selectedIds = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => parseInt(option.value));
      setEditForm({ ...editForm, [name]: selectedIds });
    } else {
      setEditForm({ ...editForm, [name]: value });
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const body = {
      ...createForm,
      startDate: createForm.startDate ? new Date(createForm.startDate) : null,
      endDate: createForm.endDate ? new Date(createForm.endDate) : null,
    };
    await fetch(`${API}/drives`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setCreateForm(initialCreateForm);
    loadDrives();
    setActiveTab("list");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const body = {
      ...editForm,
      startDate: editForm.startDate ? new Date(editForm.startDate) : null,
      endDate: editForm.endDate ? new Date(editForm.endDate) : null,
    };
    await fetch(`${API}/update/drive`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setEditForm(initialEditForm);
    loadDrives();
    setActiveTab("list");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this drive?")) return;
    await fetch(`${API}/drives/${id}`, { method: "DELETE" });
    loadDrives();
  };

  const startEdit = (d) => {
    setEditForm({
      id: d.id,
      tnpAdminId: d.tnpAdminId || "",
      driveTitle: d.driveTitle || "",
      startDate: d.startDate?.substring(0, 10) || "",
      endDate: d.endDate?.substring(0, 10) || "",
      status: d.status || "",
      jobIds: d.jobs?.map((job) => job.id) || [],
    });
    setActiveTab("edit");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500";
      case "ongoing":
        return "bg-green-500";
      case "completed":
        return "bg-gray-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "upcoming":
        return "🚀";
      case "ongoing":
        return "⚡";
      case "completed":
        return "✅";
      default:
        return "📋";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            🎯 Placement Drives
          </h1>
          <p className="text-purple-300 text-lg">
            Manage and track all recruitment drives
          </p>
        </div>

        {/* Navigation Tabs */}
        {usr?.role === "tnp" && (
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-1.5 flex gap-1">
              <button
                onClick={() => setActiveTab("list")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === "list"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                📋 All Drives
              </button>
              <button
                onClick={() => setActiveTab("create")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === "create"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                ➕ Create Drive
              </button>
              <button
                onClick={() => setActiveTab("edit")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === "edit"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                } ${!editForm.id ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={!editForm.id}
              >
                ✏️ Edit Drive
              </button>
            </div>
          </div>
        )}

        {/* Create Form */}
        {activeTab === "create" && usr?.role === "tnp" && (
          <div className="max-w-2xl mx-auto mb-8 animate-fadeIn">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center text-2xl">
                  ➕
                </div>
                <h2 className="text-2xl font-bold text-white">Create New Drive</h2>
              </div>
              
              <form onSubmit={handleCreate} className="space-y-5">
                <div>
                  <label className="block text-purple-300 text-sm font-medium mb-2">
                    Drive Title
                  </label>
                  <input
                    name="driveTitle"
                    placeholder="Enter drive title..."
                    value={createForm.driveTitle}
                    onChange={handleCreateChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-purple-300 text-sm font-medium mb-2">
                    TNP Admin
                  </label>
                  <select
                    name="tnpAdminId"
                    value={createForm.tnpAdminId}
                    onChange={handleCreateChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="" className="bg-slate-800">Select TNP Admin</option>
                    {admins.map((admin) => (
                      <option key={admin.id} value={admin.id} className="bg-slate-800">
                        {admin.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-purple-300 text-sm font-medium mb-2">
                      Start Date
                    </label>
                    <input
                      name="startDate"
                      type="date"
                      value={createForm.startDate}
                      onChange={handleCreateChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-purple-300 text-sm font-medium mb-2">
                      End Date
                    </label>
                    <input
                      name="endDate"
                      type="date"
                      value={createForm.endDate}
                      onChange={handleCreateChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-purple-300 text-sm font-medium mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={createForm.status}
                    onChange={handleCreateChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="upcoming" className="bg-slate-800">🚀 Upcoming</option>
                    <option value="ongoing" className="bg-slate-800">⚡ Ongoing</option>
                    <option value="completed" className="bg-slate-800">✅ Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-purple-300 text-sm font-medium mb-2">
                    Associated Jobs (Hold Ctrl/Cmd to select multiple)
                  </label>
                  <select
                    name="jobIds"
                    value={createForm.jobIds}
                    onChange={handleCreateChange}
                    multiple
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all h-32"
                  >
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id} className="bg-slate-800 py-2">
                        {job.jobTitle} @ {job.company?.companyName}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  🚀 Create Drive
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Edit Form */}
        {activeTab === "edit" && usr?.role === "tnp" && (
          <div className="max-w-2xl mx-auto mb-8 animate-fadeIn">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-2xl">
                  ✏️
                </div>
                <h2 className="text-2xl font-bold text-white">Edit Drive</h2>
              </div>

              {editForm.id ? (
                <form onSubmit={handleUpdate} className="space-y-5">
                  <div className="bg-purple-500/20 rounded-xl p-3 border border-purple-500/30">
                    <span className="text-purple-300 text-sm">Drive ID: </span>
                    <span className="text-white font-mono">{editForm.id}</span>
                  </div>

                  <div>
                    <label className="block text-purple-300 text-sm font-medium mb-2">
                      Drive Title
                    </label>
                    <input
                      name="driveTitle"
                      placeholder="Enter drive title..."
                      value={editForm.driveTitle}
                      onChange={handleEditChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-purple-300 text-sm font-medium mb-2">
                      TNP Admin
                    </label>
                    <select
                      name="tnpAdminId"
                      value={editForm.tnpAdminId}
                      onChange={handleEditChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="" className="bg-slate-800">Select TNP Admin</option>
                      {admins.map((admin) => (
                        <option key={admin.id} value={admin.id} className="bg-slate-800">
                          {admin.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-purple-300 text-sm font-medium mb-2">
                        Start Date
                      </label>
                      <input
                        name="startDate"
                        type="date"
                        value={editForm.startDate}
                        onChange={handleEditChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-purple-300 text-sm font-medium mb-2">
                        End Date
                      </label>
                      <input
                        name="endDate"
                        type="date"
                        value={editForm.endDate}
                        onChange={handleEditChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-purple-300 text-sm font-medium mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={editForm.status}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="upcoming" className="bg-slate-800">🚀 Upcoming</option>
                      <option value="ongoing" className="bg-slate-800">⚡ Ongoing</option>
                      <option value="completed" className="bg-slate-800">✅ Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-purple-300 text-sm font-medium mb-2">
                      Associated Jobs
                    </label>
                    <select
                      name="jobIds"
                      value={editForm.jobIds}
                      onChange={handleEditChange}
                      multiple
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all h-32"
                    >
                      {jobs.map((job) => (
                        <option key={job.id} value={job.id} className="bg-slate-800 py-2">
                          {job.jobTitle} @ {job.company?.companyName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      💾 Update Drive
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditForm(initialEditForm);
                        setActiveTab("list");
                      }}
                      className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-white/60">Select a drive from the list to edit</p>
                  <button
                    onClick={() => setActiveTab("list")}
                    className="mt-4 px-6 py-2 bg-purple-500/30 hover:bg-purple-500/50 text-purple-300 rounded-lg transition-all"
                  >
                    Go to Drive List
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Drives List */}
        {(activeTab === "list" || usr?.role !== "tnp") && (
          <div className="animate-fadeIn">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/10">
                <div className="text-3xl font-bold text-white">{drives.length}</div>
                <div className="text-purple-300 text-sm">Total Drives</div>
              </div>
              <div className="bg-blue-500/20 backdrop-blur-lg rounded-2xl p-4 border border-blue-500/30">
                <div className="text-3xl font-bold text-blue-400">
                  {drives.filter((d) => d.status === "upcoming").length}
                </div>
                <div className="text-blue-300 text-sm">Upcoming</div>
              </div>
              <div className="bg-green-500/20 backdrop-blur-lg rounded-2xl p-4 border border-green-500/30">
                <div className="text-3xl font-bold text-green-400">
                  {drives.filter((d) => d.status === "ongoing").length}
                </div>
                <div className="text-green-300 text-sm">Ongoing</div>
              </div>
              <div className="bg-gray-500/20 backdrop-blur-lg rounded-2xl p-4 border border-gray-500/30">
                <div className="text-3xl font-bold text-gray-400">
                  {drives.filter((d) => d.status === "completed").length}
                </div>
                <div className="text-gray-300 text-sm">Completed</div>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
              </div>
            ) : drives.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-8xl mb-4">📭</div>
                <h3 className="text-2xl font-bold text-white mb-2">No Drives Found</h3>
                <p className="text-white/60">Create your first placement drive to get started</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {drives.map((d) => (
                  <div
                    key={d.id}
                    className="group bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:transform hover:scale-[1.02]"
                  >
                    {/* Card Header */}
                    <div className={`h-2 ${getStatusColor(d.status)}`}></div>
                    
                    <div className="p-6">
                      {/* Title and Status */}
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                          {d.driveTitle}
                        </h3>
                        <span
                          className={`${getStatusColor(d.status)} px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1`}
                        >
                          {getStatusIcon(d.status)} {d.status}
                        </span>
                      </div>

                      {/* Admin Info */}
                      <div className="flex items-center gap-2 text-purple-300 mb-3">
                        <span className="text-lg">👤</span>
                        <span className="text-sm">{d.tnpAdmin?.name || "Not Assigned"}</span>
                      </div>

                      {/* Dates */}
                      <div className="bg-white/5 rounded-xl p-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="text-center">
                            <div className="text-white/50 text-xs mb-1">Start</div>
                            <div className="text-white font-medium">
                              {d.startDate?.slice(0, 10) || "TBA"}
                            </div>
                          </div>
                          <div className="text-purple-400">→</div>
                          <div className="text-center">
                            <div className="text-white/50 text-xs mb-1">End</div>
                            <div className="text-white font-medium">
                              {d.endDate?.slice(0, 10) || "TBA"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Jobs */}
                      <div className="mb-4">
                        <div className="text-white/50 text-xs mb-2 uppercase tracking-wider">
                          Associated Jobs
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {d.jobs?.length > 0 ? (
                            d.jobs.map((j) => (
                              <span
                                key={j.id}
                                className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-lg text-xs border border-purple-500/30"
                              >
                                💼 {j.jobTitle}
                              </span>
                            ))
                          ) : (
                            <span className="text-white/40 text-sm">No jobs linked</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-4 border-t border-white/10">
                        {usr?.role === "tnp" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(d)}
                              className="flex-1 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDelete(d.id)}
                              className="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        ) : usr?.role === "student" ? (
                          d.status === "upcoming" && (
                            <button
                              onClick={() => ApplyForJob(usr.id, d.id)}
                              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/25 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                              📤 Apply Now
                            </button>
                          )
                        ) : usr?.role === "company" ? (
                          <div className="space-y-2">
                            <button
                              onClick={() => {
                                showAppliedStudents(d.jobs[0]?.id, studentListRef, studentDetailsRef);
                                openSection(studentListRef);
                              }}
                              className="w-full py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                            >
                              👥 Applied Students
                            </button>
                            <button
                              onClick={() => {
                                showShortlistedStudents(d.jobs[0]?.id, studentListRef, studentDetailsRef);
                                openSection(studentListRef);
                              }}
                              className="w-full py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                            >
                              ⭐ Shortlisted
                            </button>
                            <button
                              onClick={() => {
                                showSelectedStudents(d.jobs[0]?.id, studentListRef, studentDetailsRef);
                                openSection(studentListRef);
                              }}
                              className="w-full py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                            >
                              ✅ Selected
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal for Student List */}
      <div
        ref={studentListRef}
        className="fixed inset-0 bg-black/60 backdrop-blur-md flex flex-col justify-center items-center scale-0 transition-transform duration-300 z-50"
      >
        <div className="w-[90%] max-w-4xl max-h-[80vh] bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-2xl font-bold text-white">📋 Student List</h3>
          </div>
          <div className="p-6 overflow-auto max-h-[60vh]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 text-purple-300">Name</th>
                  <th className="text-left py-3 text-purple-300">Email</th>
                  <th className="text-left py-3 text-purple-300">Status</th>
                  <th className="text-left py-3 text-purple-300">Actions</th>
                </tr>
              </thead>
              <tbody id="studentTableBody">
                {/* Dynamic content will be inserted here */}
              </tbody>
            </table>
          </div>
        </div>
        <button
          onClick={() => closeSection(studentListRef)}
          className="mt-4 px-8 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-semibold transition-all border border-red-500/30"
        >
          ✕ Close
        </button>
      </div>

      {/* Modal for Student Details */}
      <div
        ref={studentDetailsRef}
        className="fixed inset-0 bg-black/60 backdrop-blur-md flex flex-col justify-center items-center scale-0 transition-transform duration-300 z-50"
      >
        <div className="w-[90%] max-w-2xl max-h-[80vh] bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-2xl font-bold text-white">👤 Student Details</h3>
          </div>
          <div className="p-6 overflow-auto max-h-[60vh]">
            {/* Dynamic content */}
          </div>
        </div>
        <button
          onClick={() => closeSection(studentDetailsRef)}
          className="mt-4 px-8 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-semibold transition-all border border-red-500/30"
        >
          ✕ Close
        </button>
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
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}