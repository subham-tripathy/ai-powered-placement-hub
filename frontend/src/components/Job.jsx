import React, { useState, useEffect } from "react";
import { API } from "./functions";

const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API}${endpoint}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },
  post: async (endpoint, body) => {
    const response = await fetch(`${API}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },
  put: async (endpoint, body) => {
    const response = await fetch(`${API}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },
  delete: async (endpoint) => {
    const response = await fetch(`${API}${endpoint}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },
};

// Initial state for the form data
const initialFormData = {
  companyId: "",
  jobTitle: "",
  jobDescription: "",
  requiredSkillsText: "",
  eligibilityCgpa: "",
  eligibilityBranches: "",
  ctcPaLakhs: "",
  status: "OPEN", // Default status for new jobs
};

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [editingJobId, setEditingJobId] = useState(null); // null for 'Create' mode, an ID for 'Edit' mode
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Data Fetching Effect ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch both jobs and companies in parallel
      const [jobsResponse, companiesResponse] = await Promise.all([
        api.get("/jobs"),
        api.get("/companies"),
      ]);

      if (jobsResponse.status === "success") {
        setJobs(jobsResponse.data);
      } else {
        throw new Error(jobsResponse.message || "Failed to fetch jobs");
      }

      if (companiesResponse.status === "success") {
        setCompanies(companiesResponse.data);
      } else {
        throw new Error(
          companiesResponse.message || "Failed to fetch companies"
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Form Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const isEditing = editingJobId !== null;
    const endpoint = isEditing ? `/jobs/${editingJobId}` : "/jobs";
    const method = isEditing ? "put" : "post";

    // Convert numeric fields from string to number
    const payload = {
      ...formData,
      eligibilityCgpa: parseFloat(formData.eligibilityCgpa),
      ctcPaLakhs: parseFloat(formData.ctcPaLakhs),
    };

    // In a real app, you'd add validation here

    try {
      const response = await api[method](endpoint, payload);
      if (response.status === "success") {
        alert(`Job successfully ${isEditing ? "updated" : "created"}!`);
        resetForm();
        fetchData(); // Refresh the job list
      } else {
        throw new Error(
          response.message ||
            `Failed to ${isEditing ? "update" : "create"} job.`
        );
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleEditClick = (job) => {
    setEditingJobId(job.id);
    // Populate form with existing job data
    setFormData({
      companyId: job.companyId,
      jobTitle: job.jobTitle,
      jobDescription: job.jobDescription,
      requiredSkillsText: job.requiredSkillsText,
      eligibilityCgpa: job.eligibilityCgpa.toString(),
      eligibilityBranches: job.eligibilityBranches,
      ctcPaLakhs: job.ctcPaLakhs.toString(),
      status: job.status,
    });
    window.scrollTo(0, 0); // Scroll to top to see the form
  };

  const handleDeleteClick = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        const response = await api.delete(`/jobs/${jobId}`);
        if (response.status === "success") {
          alert("Job deleted successfully!");
          fetchData(); // Refresh the job list
        } else {
          throw new Error(response.message || "Failed to delete job.");
        }
      } catch (err) {
        alert(`Error: ${err.message}`);
      }
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingJobId(null);
  };

  // --- Render Logic ---
  if (isLoading) return <div>Loading jobs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Manage Jobs</h1>

      {/* --- Create/Edit Form --- */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          marginBottom: "20px",
          borderRadius: "8px",
        }}
      >
        <h2>{editingJobId ? "Edit Job" : "Create New Job"}</h2>
        <form onSubmit={handleFormSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label>Company: </label>
            <select
              name="companyId"
              value={formData.companyId}
              onChange={handleInputChange}
              required
            >
              <option value="">-- Select a Company --</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.companyName}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Job Title: </label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Job Description: </label>
            <textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleInputChange}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Required Skills: </label>
            <input
              type="text"
              name="requiredSkillsText"
              value={formData.requiredSkillsText}
              onChange={handleInputChange}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Eligibility CGPA: </label>
            <input
              type="number"
              step="0.01"
              name="eligibilityCgpa"
              value={formData.eligibilityCgpa}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Eligible Branches (comma-separated): </label>
            <input
              type="text"
              name="eligibilityBranches"
              value={formData.eligibilityBranches}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>CTC (in Lakhs Per Annum): </label>
            <input
              type="number"
              step="0.1"
              name="ctcPaLakhs"
              value={formData.ctcPaLakhs}
              onChange={handleInputChange}
              required
            />
          </div>
          {editingJobId && (
            <div style={{ marginBottom: "10px" }}>
              <label>Status: </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          )}
          <button type="submit">
            {editingJobId ? "Update Job" : "Create Job"}
          </button>
          {editingJobId && (
            <button
              type="button"
              onClick={resetForm}
              style={{ marginLeft: "10px" }}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* --- Jobs List Table --- */}
      <h2>Existing Jobs</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid black" }}>
            <th style={{ textAlign: "left", padding: "8px" }}>Title</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Company</th>
            <th style={{ textAlign: "left", padding: "8px" }}>CTC (LPA)</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Status</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} style={{ borderBottom: "1px solid #ccc" }}>
              <td style={{ padding: "8px" }}>{job.jobTitle}</td>
              <td style={{ padding: "8px" }}>
                {job.company?.companyName || "N/A"}
              </td>
              <td style={{ padding: "8px" }}>{job.ctcPaLakhs}</td>
              <td style={{ padding: "8px" }}>{job.status}</td>
              <td style={{ padding: "8px" }}>
                <button onClick={() => handleEditClick(job)}>Edit</button>
                <button
                  onClick={() => handleDeleteClick(job.id)}
                  style={{ marginLeft: "5px" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Jobs;
