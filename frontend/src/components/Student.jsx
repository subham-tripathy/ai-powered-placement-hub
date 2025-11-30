import { useContext, useEffect, useRef, useState } from "react";
import { API, closeSection, openSection, showDetails } from "./functions";
import { LoginContext } from "./ContextProvider";
import { jwtDecode } from "jwt-decode";

const pickData = (res) => (res?.data !== undefined ? res.data : res);

const initialCreateForm = {
  id: "",
  email: "",
  password: "",
  fullName: "",
  branch: "",
  batchYear: "",
  cgpa: "",
  phoneNumber: "",
  resumeUrl: "",
};

const initialEditForm = {
  id: "",
  email: "",
  fullName: "",
  branch: "",
  batchYear: "",
  cgpa: "",
  activeBacklogs: 0,
  phoneNumber: "",
  resumeUrl: "",
};

export default function Student() {
  const { user } = useContext(LoginContext);
  const [usr, setUsr] = useState(user == null ? null : jwtDecode(user));
  const [activeTab, setActiveTab] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBranch, setFilterBranch] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const studentDetailsRef = useRef(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [createForm, setCreateForm] = useState(initialCreateForm);
  const [editForm, setEditForm] = useState(initialEditForm);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/students`);
      const json = await res.json();
      setStudents(Array.isArray(json) ? json : pickData(json) || []);
    } catch (e) {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm({ ...createForm, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const body = {
      id: createForm.id,
      email: createForm.email,
      pw: createForm.password,
      fullName: createForm.fullName,
      branch: createForm.branch,
      batchYear: parseInt(createForm.batchYear) || null,
      cgpa: parseFloat(createForm.cgpa) || null,
      phoneNumber: createForm.phoneNumber,
      resumeUrl: createForm.resumeUrl,
    };

    await fetch(`${API}/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setCreateForm(initialCreateForm);
    loadStudents();
    setActiveTab("list");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const body = {
      id: editForm.id,
      email: editForm.email,
      fullName: editForm.fullName,
      branch: editForm.branch,
      batchYear: parseInt(editForm.batchYear) || null,
      cgpa: parseFloat(editForm.cgpa) || null,
      activeBacklogs: parseInt(editForm.activeBacklogs) || 0,
      phoneNumber: editForm.phoneNumber,
      resumeUrl: editForm.resumeUrl,
    };
    await fetch(`${API}/update/student`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setEditForm(initialEditForm);
    setTimeout(() => {
      loadStudents();
    }, 100);
    setActiveTab("list");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student? This will also delete their user login.")) return;
    await fetch(`${API}/students/${id}`, { method: "DELETE" });
    loadStudents();
  };

  const startEdit = (s) => {
    setEditForm({
      id: s.id,
      email: s.user?.email || "",
      fullName: s.fullName || "",
      branch: s.branch || "",
      batchYear: s.batchYear || "",
      cgpa: s.cgpa || "",
      activeBacklogs: s.activeBacklogs || 0,
      phoneNumber: s.phoneNumber || "",
      resumeUrl: s.resumeUrl || "",
    });
    setActiveTab("edit");
  };

  // Get unique branches for filter
  const branches = [...new Set(students.map((s) => s.branch).filter(Boolean))];

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = filterBranch === "all" || s.branch === filterBranch;
    return matchesSearch && matchesBranch;
  });

  // Calculate stats
  const avgCgpa = students.length > 0
    ? (students.reduce((acc, s) => acc + (parseFloat(s.cgpa) || 0), 0) / students.filter((s) => s.cgpa).length).toFixed(2)
    : 0;

  const getBranchColor = (branch) => {
    const colors = {
      CS: "from-blue-500 to-cyan-500",
      IT: "from-purple-500 to-pink-500",
      ECE: "from-green-500 to-emerald-500",
      EE: "from-yellow-500 to-orange-500",
      ME: "from-red-500 to-rose-500",
      CE: "from-indigo-500 to-violet-500",
    };
    return colors[branch] || "from-gray-500 to-slate-500";
  };

  const getCgpaColor = (cgpa) => {
    if (cgpa >= 9) return "text-green-400";
    if (cgpa >= 8) return "text-blue-400";
    if (cgpa >= 7) return "text-yellow-400";
    if (cgpa >= 6) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            🎓 Student Management
          </h1>
          <p className="text-indigo-300 text-lg">
            Manage student profiles and academic records
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
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                📋 All Students
              </button>
              <button
                onClick={() => setActiveTab("create")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === "create"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                ➕ Add Student
              </button>
              <button
                onClick={() => setActiveTab("edit")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === "edit"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                } ${!editForm.id ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={!editForm.id}
              >
                ✏️ Edit Student
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
                  🎓
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Add New Student</h2>
                  <p className="text-indigo-300 text-sm">Create a new student profile</p>
                </div>
              </div>

              <form onSubmit={handleCreate} className="space-y-5">
                {/* Login Credentials Section */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <span className="text-lg">🔐</span> Login Credentials
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-indigo-300 text-sm font-medium mb-2">
                        Login ID *
                      </label>
                      <input
                        name="id"
                        placeholder="e.g., STU001"
                        value={createForm.id}
                        onChange={handleCreateChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-indigo-300 text-sm font-medium mb-2">
                        Password *
                      </label>
                      <input
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={createForm.password}
                        onChange={handleCreateChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Personal Info Section */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <span className="text-lg">👤</span> Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-indigo-300 text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <input
                        name="fullName"
                        placeholder="Enter full name"
                        value={createForm.fullName}
                        onChange={handleCreateChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-indigo-300 text-sm font-medium mb-2">
                        Email *
                      </label>
                      <input
                        name="email"
                        type="email"
                        placeholder="student@example.com"
                        value={createForm.email}
                        onChange={handleCreateChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-indigo-300 text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <input
                        name="phoneNumber"
                        placeholder="+91 XXXXX XXXXX"
                        value={createForm.phoneNumber}
                        onChange={handleCreateChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Info Section */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <span className="text-lg">📚</span> Academic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-indigo-300 text-sm font-medium mb-2">
                        Branch
                      </label>
                      <select
                        name="branch"
                        value={createForm.branch}
                        onChange={handleCreateChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      >
                        <option value="" className="bg-slate-800">Select Branch</option>
                        <option value="CS" className="bg-slate-800">Computer Science</option>
                        <option value="IT" className="bg-slate-800">Information Technology</option>
                        <option value="ECE" className="bg-slate-800">Electronics & Communication</option>
                        <option value="EE" className="bg-slate-800">Electrical Engineering</option>
                        <option value="ME" className="bg-slate-800">Mechanical Engineering</option>
                        <option value="CE" className="bg-slate-800">Civil Engineering</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-indigo-300 text-sm font-medium mb-2">
                        Batch Year
                      </label>
                      <input
                        name="batchYear"
                        type="number"
                        placeholder="2025"
                        value={createForm.batchYear}
                        onChange={handleCreateChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-indigo-300 text-sm font-medium mb-2">
                        CGPA
                      </label>
                      <input
                        name="cgpa"
                        type="number"
                        step="0.01"
                        placeholder="8.50"
                        value={createForm.cgpa}
                        onChange={handleCreateChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Resume Section */}
                <div>
                  <label className="block text-indigo-300 text-sm font-medium mb-2">
                    Resume URL
                  </label>
                  <input
                    name="resumeUrl"
                    placeholder="https://drive.google.com/..."
                    value={createForm.resumeUrl}
                    onChange={handleCreateChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  ✨ Create Student Profile
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
                <div>
                  <h2 className="text-2xl font-bold text-white">Edit Student</h2>
                  <p className="text-indigo-300 text-sm">Update student information</p>
                </div>
              </div>

              {editForm.id ? (
                <form onSubmit={handleUpdate} className="space-y-5">
                  <div className="bg-indigo-500/20 rounded-xl p-3 border border-indigo-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-indigo-300 text-sm">Student ID: </span>
                      <span className="text-white font-mono font-bold">{editForm.id}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditForm(initialEditForm);
                        setActiveTab("list");
                      }}
                      className="text-indigo-400 hover:text-white transition-colors"
                    >
                      ✕ Cancel Edit
                    </button>
                  </div>

                  {/* Personal Info Section */}
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <span className="text-lg">👤</span> Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-indigo-300 text-sm font-medium mb-2">
                          Full Name *
                        </label>
                        <input
                          name="fullName"
                          placeholder="Enter full name"
                          value={editForm.fullName}
                          onChange={handleEditChange}
                          required
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-indigo-300 text-sm font-medium mb-2">
                          Email *
                        </label>
                        <input
                          name="email"
                          type="email"
                          placeholder="student@example.com"
                          value={editForm.email}
                          onChange={handleEditChange}
                          required
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-indigo-300 text-sm font-medium mb-2">
                          Phone Number
                        </label>
                        <input
                          name="phoneNumber"
                          placeholder="+91 XXXXX XXXXX"
                          value={editForm.phoneNumber}
                          onChange={handleEditChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Academic Info Section */}
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <span className="text-lg">📚</span> Academic Information
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-indigo-300 text-sm font-medium mb-2">
                          Branch
                        </label>
                        <select
                          name="branch"
                          value={editForm.branch}
                          onChange={handleEditChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        >
                          <option value="" className="bg-slate-800">Select</option>
                          <option value="CS" className="bg-slate-800">CS</option>
                          <option value="IT" className="bg-slate-800">IT</option>
                          <option value="ECE" className="bg-slate-800">ECE</option>
                          <option value="EE" className="bg-slate-800">EE</option>
                          <option value="ME" className="bg-slate-800">ME</option>
                          <option value="CE" className="bg-slate-800">CE</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-indigo-300 text-sm font-medium mb-2">
                          Batch Year
                        </label>
                        <input
                          name="batchYear"
                          type="number"
                          placeholder="2025"
                          value={editForm.batchYear}
                          onChange={handleEditChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-indigo-300 text-sm font-medium mb-2">
                          CGPA
                        </label>
                        <input
                          name="cgpa"
                          type="number"
                          step="0.01"
                          placeholder="8.50"
                          value={editForm.cgpa}
                          onChange={handleEditChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-indigo-300 text-sm font-medium mb-2">
                          Backlogs
                        </label>
                        <input
                          name="activeBacklogs"
                          type="number"
                          placeholder="0"
                          value={editForm.activeBacklogs}
                          onChange={handleEditChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Resume Section */}
                  <div>
                    <label className="block text-indigo-300 text-sm font-medium mb-2">
                      Resume URL
                    </label>
                    <input
                      name="resumeUrl"
                      placeholder="https://drive.google.com/..."
                      value={editForm.resumeUrl}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      💾 Update Student
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-white/60">Select a student from the list to edit</p>
                  <button
                    onClick={() => setActiveTab("list")}
                    className="mt-4 px-6 py-2 bg-indigo-500/30 hover:bg-indigo-500/50 text-indigo-300 rounded-lg transition-all"
                  >
                    Go to Student List
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Students List */}
        {(activeTab === "list" || usr?.role !== "tnp") && (
          <div className="animate-fadeIn">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500/30 rounded-xl flex items-center justify-center text-xl">
                    🎓
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{students.length}</div>
                    <div className="text-indigo-300 text-sm">Total Students</div>
                  </div>
                </div>
              </div>
              <div className="bg-green-500/20 backdrop-blur-lg rounded-2xl p-4 border border-green-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/30 rounded-xl flex items-center justify-center text-xl">
                    📊
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">{avgCgpa}</div>
                    <div className="text-green-300 text-sm">Avg CGPA</div>
                  </div>
                </div>
              </div>
              <div className="bg-blue-500/20 backdrop-blur-lg rounded-2xl p-4 border border-blue-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/30 rounded-xl flex items-center justify-center text-xl">
                    🏢
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">{branches.length}</div>
                    <div className="text-blue-300 text-sm">Branches</div>
                  </div>
                </div>
              </div>
              <div className="bg-purple-500/20 backdrop-blur-lg rounded-2xl p-4 border border-purple-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/30 rounded-xl flex items-center justify-center text-xl">
                    ⭐
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">
                      {students.filter((s) => parseFloat(s.cgpa) >= 8).length}
                    </div>
                    <div className="text-purple-300 text-sm">CGPA 8+</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-white/10">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                    🔍
                  </span>
                  <input
                    type="text"
                    placeholder="Search by name, email, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <select
                  value={filterBranch}
                  onChange={(e) => setFilterBranch(e.target.value)}
                  className="px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="all" className="bg-slate-800">All Branches</option>
                  {branches.map((branch) => (
                    <option key={branch} value={branch} className="bg-slate-800">
                      {branch}
                    </option>
                  ))}
                </select>
                <div className="text-white/60 flex items-center px-4 bg-white/5 rounded-xl border border-white/10">
                  Showing {filteredStudents.length} of {students.length}
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent"></div>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-8xl mb-4">📭</div>
                <h3 className="text-2xl font-bold text-white mb-2">No Students Found</h3>
                <p className="text-white/60">
                  {searchTerm || filterBranch !== "all"
                    ? "Try adjusting your search or filter"
                    : "Add your first student to get started"}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredStudents.map((s) => (
                  <div
                    key={s.id}
                    className="group bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:transform hover:scale-[1.02]"
                  >
                    {/* Card Header with Branch Color */}
                    <div className={`h-2 bg-gradient-to-r ${getBranchColor(s.branch)}`}></div>

                    <div className="p-6">
                      {/* Avatar and Name */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-14 h-14 bg-gradient-to-r ${getBranchColor(s.branch)} rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                          {s.fullName?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                            {s.fullName}
                          </h3>
                          <p className="text-indigo-300 text-sm truncate">{s.user?.email}</p>
                          <p className="text-white/50 text-xs font-mono">ID: {s.id}</p>
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-white/5 rounded-xl p-3 text-center">
                          <div className="text-white/50 text-xs mb-1">Branch</div>
                          <div className={`font-bold bg-gradient-to-r ${getBranchColor(s.branch)} bg-clip-text text-transparent`}>
                            {s.branch || "N/A"}
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 text-center">
                          <div className="text-white/50 text-xs mb-1">Batch</div>
                          <div className="text-white font-bold">{s.batchYear || "N/A"}</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 text-center">
                          <div className="text-white/50 text-xs mb-1">CGPA</div>
                          <div className={`font-bold ${getCgpaColor(s.cgpa)}`}>
                            {s.cgpa ?? "N/A"}
                          </div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      {(s.phoneNumber || s.activeBacklogs > 0) && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {s.phoneNumber && (
                            <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-lg text-xs border border-indigo-500/30 flex items-center gap-1">
                              📱 {s.phoneNumber}
                            </span>
                          )}
                          {s.activeBacklogs > 0 && (
                            <span className="bg-red-500/20 text-red-300 px-3 py-1 rounded-lg text-xs border border-red-500/30 flex items-center gap-1">
                              ⚠️ {s.activeBacklogs} Backlog{s.activeBacklogs > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="pt-4 border-t border-white/10 flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedStudent(s);
                            openSection(studentDetailsRef);
                            showDetails(studentDetailsRef, s);
                          }}
                          className="flex-1 py-2.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                        >
                          👁️ View
                        </button>
                        {s.resumeUrl && (
                          <a
                            href={s.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                          >
                            📄 Resume
                          </a>
                        )}
                        {usr?.role === "tnp" && (
                          <>
                            <button
                              onClick={() => startEdit(s)}
                              className="py-2.5 px-4 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-xl font-medium transition-all"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDelete(s.id)}
                              className="py-2.5 px-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-medium transition-all"
                            >
                              🗑️
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Student Details Modal */}
      <div
        ref={studentDetailsRef}
        className="fixed inset-0 bg-black/60 backdrop-blur-md flex flex-col justify-center items-center scale-0 transition-transform duration-300 z-50"
      >
        <div className="w-[90%] max-w-2xl max-h-[85vh] bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          {selectedStudent && (
            <>
              {/* Modal Header */}
              <div className={`h-3 bg-gradient-to-r ${getBranchColor(selectedStudent.branch)}`}></div>
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${getBranchColor(selectedStudent.branch)} rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                    {selectedStudent.fullName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedStudent.fullName}</h3>
                    <p className="text-indigo-300">{selectedStudent.user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-auto max-h-[50vh]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-indigo-300 text-sm mb-1">Student ID</div>
                    <div className="text-white font-mono font-bold">{selectedStudent.id}</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-indigo-300 text-sm mb-1">Branch</div>
                    <div className={`font-bold bg-gradient-to-r ${getBranchColor(selectedStudent.branch)} bg-clip-text text-transparent`}>
                      {selectedStudent.branch || "N/A"}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-indigo-300 text-sm mb-1">Batch Year</div>
                    <div className="text-white font-bold">{selectedStudent.batchYear || "N/A"}</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-indigo-300 text-sm mb-1">CGPA</div>
                    <div className={`font-bold text-xl ${getCgpaColor(selectedStudent.cgpa)}`}>
                      {selectedStudent.cgpa ?? "N/A"}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-indigo-300 text-sm mb-1">Phone Number</div>
                    <div className="text-white">{selectedStudent.phoneNumber || "Not provided"}</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-indigo-300 text-sm mb-1">Active Backlogs</div>
                    <div className={`font-bold ${selectedStudent.activeBacklogs > 0 ? "text-red-400" : "text-green-400"}`}>
                      {selectedStudent.activeBacklogs || 0}
                    </div>
                  </div>
                </div>

                {selectedStudent.resumeUrl && (
                  <div className="mt-4">
                    <a
                      href={selectedStudent.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      📄 View Resume
                    </a>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <button
          onClick={() => {
            closeSection(studentDetailsRef);
            setSelectedStudent(null);
          }}
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