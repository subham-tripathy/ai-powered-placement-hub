const express = require("express");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

// Updated and cleaned up imports to match the new server_function.js
const {
  // TnpAdmin
  createAdmin,
  getAdminById,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,

  // Company
  createCompany,
  getCompanyById,
  getAllCompanies,
  updateCompany,
  deleteCompany,

  // Student
  createStudent,
  getStudentById,
  getAllStudents,
  updateStudent,
  deleteStudent,

  // StudentAchievement
  createStudentAchievement,
  getStudentAchievementById,
  getStudentAchievementsByStudentId,
  updateStudentAchievement,
  deleteStudentAchievement,

  // StudentInternship
  createStudentInternship,
  getStudentInternshipById,
  getStudentInternshipsByStudentId,
  updateStudentInternship,
  deleteStudentInternship,

  // Job
  createJob,
  getJobById,
  getAllJobs,
  updateJob,
  deleteJob,

  // Drive
  createDrive,
  getDriveById,
  getAllDrives,
  updateDrive,
  deleteDrive,

  // Application
  createApplication,
  getApplicationById,
  getApplicationsByJobId,
  getApplicationsByStudentId,
  updateApplicationStatus,
  deleteApplication,

  // Auth function
  login,
  uploadResume,
  downloadResume,
  rankStudents,
  getApplicationsByJobIdAndStatus,
} = require("./server_functions");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running smoothly!");
});

// =================================================================
// AUTHENTICATION
// =================================================================
app.post("/api/auth/login", async (req, res) => {
  return login(req, res);
});

// =================================================================
// TNP ADMIN ROUTES
// =================================================================
app.post("/api/admins", async (req, res) => {
  const { id, email, name, phno, pw } = req.body;
  res.json(await createAdmin(id, email, name, phno, pw));
});

app.get("/api/admins", async (req, res) => {
  res.json(await getAllAdmins());
});

app.get("/api/admins/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await getAdminById(id));
});

app.put("/api/admins/:id", async (req, res) => {
  const { id } = req.params;
  const { email, name, phno } = req.body;
  res.json(await updateAdmin(id, email, name, phno));
});

app.delete("/api/admins/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await deleteAdmin(id));
});

// =================================================================
// COMPANY ROUTES
// =================================================================
app.post("/api/companies", async (req, res) => {
  const { id, email, pw, companyName, companyType, websiteUrl, hrName } =
    req.body;
  res.json(
    await createCompany(
      id,
      email,
      pw,
      companyName,
      companyType,
      websiteUrl,
      hrName
    )
  );
});

app.get("/api/companies", async (req, res) => {
  res.json(await getAllCompanies());
});

app.get("/api/companies/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await getCompanyById(id));
});

app.put("/api/companies/:id", async (req, res) => {
  const { id } = req.params;
  const { email, companyName, companyType, hrName, websiteUrl } = req.body;
  res.json(
    await updateCompany(id, email, companyName, companyType, hrName, websiteUrl)
  );
});

app.delete("/api/companies/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await deleteCompany(id));
});

// =================================================================
// STUDENT ROUTES
// =================================================================
app.post("/api/students", async (req, res) => {
  const {
    id,
    email,
    pw,
    fullName,
    branch,
    batchYear,
    cgpa,
    phoneNumber,
    resumeUrl,
  } = req.body;
  res.json(
    await createStudent(
      id,
      email,
      pw,
      fullName,
      branch,
      batchYear,
      cgpa,
      phoneNumber,
      resumeUrl
    )
  );
});

app.get("/api/students", async (req, res) => {
  res.json(await getAllStudents());
});

app.get("/api/students/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await getStudentById(id));
});

app.post("/api/update/student", async (req, res) => {
  const { id } = req.body;
  const {
    email,
    fullName,
    branch,
    batchYear,
    cgpa,
    activeBacklogs,
    phoneNumber,
    resumeUrl,
  } = req.body;
  res.json(
    await updateStudent(
      id,
      email,
      fullName,
      branch,
      batchYear,
      cgpa,
      activeBacklogs,
      phoneNumber,
      resumeUrl
    )
  );
});

app.delete("/api/students/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await deleteStudent(id));
});

// =================================================================
// STUDENT ACHIEVEMENT ROUTES
// =================================================================
app.post("/api/achievements", async (req, res) => {
  const { studentId, title, description, achievementDate, certificateUrl } =
    req.body;
  res.json(
    await createStudentAchievement(
      studentId,
      title,
      description,
      achievementDate,
      certificateUrl
    )
  );
});

app.get("/api/students/:studentId/achievements", async (req, res) => {
  const { studentId } = req.params;
  res.json(await getStudentAchievementsByStudentId(studentId));
});

app.get("/api/achievements/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await getStudentAchievementById(id));
});

app.put("/api/achievements/:id", async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    achievementDate,
    certificateUrl,
    verificationStatus,
  } = req.body;
  res.json(
    await updateStudentAchievement(
      id,
      title,
      description,
      achievementDate,
      certificateUrl,
      verificationStatus
    )
  );
});

app.delete("/api/achievements/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await deleteStudentAchievement(id));
});

// =================================================================
// STUDENT INTERNSHIP ROUTES
// =================================================================
app.post("/api/internships", async (req, res) => {
  const {
    studentId,
    role,
    companyName,
    startDate,
    endDate,
    certificateUrl,
    description,
  } = req.body;
  res.json(
    await createStudentInternship(
      studentId,
      role,
      companyName,
      startDate,
      endDate,
      certificateUrl,
      description
    )
  );
});

app.get("/api/students/:studentId/internships", async (req, res) => {
  const { studentId } = req.params;
  res.json(await getStudentInternshipsByStudentId(studentId));
});

app.get("/api/internships/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await getStudentInternshipById(id));
});

app.put("/api/internships/:id", async (req, res) => {
  const { id } = req.params;
  const { role, companyName, startDate, endDate, certificateUrl, description } =
    req.body;
  res.json(
    await updateStudentInternship(
      id,
      role,
      companyName,
      startDate,
      endDate,
      certificateUrl,
      description
    )
  );
});

app.delete("/api/internships/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await deleteStudentInternship(id));
});

// =================================================================
// JOB ROUTES
// =================================================================
app.post("/api/jobs", async (req, res) => {
  const {
    companyId,
    jobTitle,
    jobDescription,
    requiredSkillsText,
    eligibilityCgpa,
    eligibilityBranches,
    ctcPaLakhs,
  } = req.body;
  res.json(
    await createJob(
      companyId,
      jobTitle,
      jobDescription,
      requiredSkillsText,
      eligibilityCgpa,
      eligibilityBranches,
      ctcPaLakhs
    )
  );
});

app.get("/api/jobs", async (req, res) => {
  res.json(await getAllJobs());
});

app.get("/api/jobs/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await getJobById(id));
});

app.put("/api/jobs/:id", async (req, res) => {
  const { id } = req.params;
  const {
    jobTitle,
    jobDescription,
    requiredSkillsText,
    eligibilityCgpa,
    eligibilityBranches,
    ctcPaLakhs,
    status,
  } = req.body;
  res.json(
    await updateJob(
      parseInt(id),
      jobTitle,
      jobDescription,
      requiredSkillsText,
      eligibilityCgpa,
      eligibilityBranches,
      ctcPaLakhs,
      status
    )
  );
});

app.delete("/api/jobs/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await deleteJob(parseInt(id)));
});

// =================================================================
// DRIVE ROUTES
// =================================================================
app.post("/api/drives", async (req, res) => {
  console.log(req.body);
  const { tnpAdminId, driveTitle, startDate, endDate, status, jobIds } =
    req.body;
  res.json(
    await createDrive(
      tnpAdminId,
      driveTitle,
      startDate,
      endDate,
      status,
      jobIds
    )
  );
});

app.get("/api/drives", async (req, res) => {
  res.json(await getAllDrives());
});

app.get("/api/drives/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await getDriveById(id));
});

app.post("/api/update/drive", async (req, res) => {
  const { id, driveTitle, startDate, endDate, status, jobIds } = req.body;
  res.json(
    await updateDrive(id, driveTitle, startDate, endDate, status, jobIds)
  );
});

app.delete("/api/drives/", async (req, res) => {
  const { id } = req.body;
  res.json(await deleteDrive(id));
});

// =================================================================
// APPLICATION ROUTES
// =================================================================
app.post("/api/applications", async (req, res) => {
  const { studentId, jobId } = req.body;
  res.json(await createApplication(studentId, jobId));
});

app.get("/api/applications/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await getApplicationById(id));
});

app.put("/api/applications/update", async (req, res) => {
  const { app_id, status } = req.body;
  try {
    const result = await updateApplicationStatus(app_id, status);
    res.json(result);
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// Get all applications for a specific job
app.get("/api/jobs/:jobId/applications", async (req, res) => {
  const { jobId } = req.params;
  res.json(await getApplicationsByJobId(parseInt(jobId)));
});

app.get("/api/jobs/:jobId/applications/status/:stat", async (req, res) => {
  const { jobId, stat } = req.params;
  console.log(jobId, stat)
  res.json(await getApplicationsByJobIdAndStatus(parseInt(jobId), stat));
});

// Get all applications by a specific student
app.get("/api/students/:studentId/applications", async (req, res) => {
  const { studentId } = req.params;
  res.json(await getApplicationsByStudentId(studentId));
});

app.delete("/api/applications/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await deleteApplication(id));
});

// =================================================================
// STUDENT EDUCATION ROUTES
// =================================================================
app.get("/api/student-education", async (req, res) => {
  const { studentId, jobId } = req.body;
  res.json(await createApplication(studentId, jobId));
});

app.get("/api/applications/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await getApplicationById(id));
});

// Get all applications for a specific job
app.get("/api/jobs/:jobId/applications", async (req, res) => {
  const { jobId } = req.params;
  res.json(await getApplicationsByJobId(jobId));
});

// Get all applications by a specific student
app.get("/api/students/:studentId/applications", async (req, res) => {
  const { studentId } = req.params;
  res.json(await getApplicationsByStudentId(studentId));
});

app.delete("/api/applications/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await deleteApplication(id));
});

// storage config
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// upload resume
app.post("/api/upload-resume", upload.single("resume"), async (req, res) => {
  console.log(req.body);
  const x = await uploadResume(req, res);
  console.log(x);
  res.json(x);
});

// download resume
app.post("/api/download-resume/", async (req, res) => {
  const { studentId } = req.body;
  try {
    const resume = await downloadResume(studentId);
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    // Set headers to trigger download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=resume_${studentId}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    // Send the raw buffer
    res.send(resume.data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/jobs/:id/rank", async (req, res) => {
  console.log(req.body);
  const { id } = req.body;
  const x = await rankStudents(parseInt(id));
  res.json(x);
});

app.listen(6969, () => {
  console.log(`Server running on port: 6969 !!! ✅`);
});
