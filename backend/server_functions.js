const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const FormData = require("form-data");
const path = require("path");
const { default: axios } = require("axios");
const Flask_API = "http://localhost:5000";

/* ---------------------- TnpAdmin ---------------------- */
// NOTE: These functions are correctly implemented according to the new schema and used as a reference.
async function createAdmin(id, email, name, phno, pw) {
  try {
    const u = await prisma.user.findUnique({ where: { id: id } });
    if (!u) {
      await prisma.user.create({
        data: {
          id: id,
          email: email,
          passwordHash: await bcrypt.hash(pw, 10),
          role: "tnp",
        },
      });
      await prisma.tnpAdmin.create({
        data: { id: id, userId: id, name: name, phoneNumber: phno },
      });
      return { status: "success" };
    } else {
      return { status: "error", message: "duplicate id" };
    }
  } catch (error) {
    console.error("createAdmin error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function getAdminById(id) {
  try {
    const data = await prisma.tnpAdmin.findUnique({
      where: { id },
      include: { user: true },
    });
    return { status: "success", data };
  } catch (error) {
    console.error("getAdminById error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function getAllAdmins() {
  try {
    const data = await prisma.tnpAdmin.findMany({ include: { user: true } });
    return { status: "success", data };
  } catch (error) {
    console.error("getAllAdmins error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function updateAdmin(id, email, name, phno) {
  try {
    await prisma.user.update({
      where: { id },
      data: { email },
    });
    await prisma.tnpAdmin.update({
      where: { id },
      data: { name, phoneNumber: phno },
    });
    return { status: "success" };
  } catch (error) {
    console.error("updateAdmin error:", error);
    return { status: "error", message: "Unexpected error" };
  }
}

async function deleteAdmin(id) {
  try {
    // The schema's `onDelete: Cascade` on the User relation handles this,
    // but explicit deletion is a safe pattern.
    await prisma.tnpAdmin.delete({ where: { id } });
    await prisma.user.delete({ where: { id } });
    return { status: "success" };
  } catch (error) {
    console.log("deleteAdmin error:", error);
    return { status: "error", message: "Unexpected error" };
  }
}

/* ---------------------- Company (Updated) ---------------------- */
async function createCompany(
  id,
  email,
  pw,
  companyName,
  companyType,
  websiteUrl,
  hrName
) {
  try {
    const u = await prisma.user.findUnique({ where: { id: id } });
    if (!u) {
      await prisma.user.create({
        data: {
          id: id,
          email: email,
          passwordHash: await bcrypt.hash(pw, 10),
          role: "company",
        },
      });
      await prisma.company.create({
        data: {
          id: id,
          userId: id,
          companyName,
          companyType,
          websiteUrl,
          hrName,
        },
      });
      return { status: "success" };
    } else {
      return { status: "error", message: "duplicate id" };
    }
  } catch (error) {
    console.error("createCompany error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function getCompanyById(id) {
  try {
    const data = await prisma.company.findUnique({
      where: { id },
      include: { user: true, jobs: true },
    });
    return { status: "success", data };
  } catch (error) {
    console.error("getCompanyById error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function getAllCompanies() {
  try {
    const data = await prisma.company.findMany({ include: { user: true } });
    return { status: "success", data };
  } catch (error) {
    console.error("getAllCompanies error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function updateCompany(
  id,
  companyName,
  email,
  companyType,
  hrName,
  websiteUrl,
  pw
) {
  try {
    await prisma.user.update({
      where: { id },
      data: { email },
    });
    const data = await prisma.company.update({
      where: { id },
      data: {
        companyName,
        companyType,
        websiteUrl,
        hrName,
      },
    });
    return { status: "success", data };
  } catch (error) {
    console.error("updateCompany error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function deleteCompany(id) {
  try {
    // The schema's `onDelete: Cascade` on the User relation handles this,
    // but explicit deletion is a safe pattern.
    await prisma.company.delete({ where: { id } });
    await prisma.user.delete({ where: { id } });
    return { status: "success" };
  } catch (error) {
    console.error("deleteCompany error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

/* ---------------------- Student (Updated) ---------------------- */
async function createStudent(
  id,
  email,
  pw,
  fullName,
  branch,
  batchYear,
  cgpa,
  phoneNumber,
  resumeUrl
) {
  try {
    const u = await prisma.user.findUnique({ where: { id: id } });
    if (!u) {
      await prisma.user.create({
        data: {
          id: id,
          email: email,
          passwordHash: await bcrypt.hash(pw, 10),
          role: "student",
        },
      });
      await prisma.student.create({
        data: {
          id: id,
          userId: id,
          fullName,
          branch,
          batchYear,
          cgpa,
          phoneNumber,
          resumeUrl,
        },
      });
      return { status: "success" };
    } else {
      return { status: "error", message: "duplicate id" };
    }
  } catch (error) {
    console.error("createStudent error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function getStudentById(id) {
  try {
    const data = await prisma.student.findUnique({
      where: { id },
      include: {
        user: true,
        achievements: true,
        internships: true,
        applications: { include: { job: { include: { company: true } } } },
      },
    });
    return { status: "success", data };
  } catch (error) {
    console.error("getStudentById error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function getAllStudents() {
  try {
    const data = await prisma.student.findMany({ include: { user: true } });
    return { status: "success", data };
  } catch (error) {
    console.error("getAllStudents error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function updateStudent(
  id,
  email,
  fullName,
  branch,
  batchYear,
  cgpa,
  activeBacklogs,
  phoneNumber,
  resumeUrl
) {
  try {
    await prisma.user.update({
      where: { id },
      data: { email },
    });
    const data = await prisma.student.update({
      where: { id },
      data: {
        fullName,
        branch,
        batchYear,
        cgpa,
        activeBacklogs,
        phoneNumber,
        resumeUrl,
      },
    });
    return { status: "success", data };
  } catch (error) {
    console.error("updateStudent error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function deleteStudent(id) {
  try {
    // The schema's `onDelete: Cascade` on the User relation handles this,
    // but explicit deletion is a safe pattern.
    await prisma.student.delete({ where: { id } });
    await prisma.user.delete({ where: { id } });
    return { status: "success" };
  } catch (error) {
    console.error("deleteStudent error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

/* ---------------------- StudentAchievement (New) ---------------------- */
async function createStudentAchievement(
  studentId,
  title,
  description,
  achievementDate,
  certificateUrl
) {
  try {
    const data = await prisma.studentAchievement.create({
      data: { studentId, title, description, achievementDate, certificateUrl },
    });
    return { status: "success", data };
  } catch (error) {
    console.error("createStudentAchievement error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function getStudentAchievementById(id) {
  try {
    const data = await prisma.studentAchievement.findUnique({ where: { id } });
    return { status: "success", data };
  } catch (error) {
    console.error("getStudentAchievementById error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function getStudentAchievementsByStudentId(studentId) {
  try {
    const data = await prisma.studentAchievement.findMany({
      where: { studentId },
    });
    return { status: "success", data };
  } catch (error) {
    console.error("getStudentAchievementsByStudentId error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function updateStudentAchievement(
  id,
  title,
  description,
  achievementDate,
  certificateUrl,
  verificationStatus
) {
  try {
    const data = await prisma.studentAchievement.update({
      where: { id },
      data: {
        title,
        description,
        achievementDate,
        certificateUrl,
        verificationStatus,
      },
    });
    return { status: "success", data };
  } catch (error) {
    console.error("updateStudentAchievement error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function deleteStudentAchievement(id) {
  try {
    const data = await prisma.studentAchievement.delete({ where: { id } });
    return { status: "success", data };
  } catch (error) {
    console.error("deleteStudentAchievement error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

/* ---------------------- StudentInternship (New) ---------------------- */
async function createStudentInternship(
  studentId,
  role,
  companyName,
  startDate,
  endDate,
  certificateUrl,
  description
) {
  try {
    const data = await prisma.studentInternship.create({
      data: {
        studentId,
        role,
        companyName,
        startDate,
        endDate,
        certificateUrl,
        description,
      },
    });
    return { status: "success", data };
  } catch (error) {
    console.error("createStudentInternship error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function getStudentInternshipById(id) {
  try {
    const data = await prisma.studentInternship.findUnique({ where: { id } });
    return { status: "success", data };
  } catch (error) {
    console.error("getStudentInternshipById error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function getStudentInternshipsByStudentId(studentId) {
  try {
    const data = await prisma.studentInternship.findMany({
      where: { studentId },
    });
    return { status: "success", data };
  } catch (error) {
    console.error("getStudentInternshipsByStudentId error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function updateStudentInternship(
  id,
  role,
  companyName,
  startDate,
  endDate,
  certificateUrl,
  description
) {
  try {
    const data = await prisma.studentInternship.update({
      where: { id },
      data: {
        role,
        companyName,
        startDate,
        endDate,
        certificateUrl,
        description,
      },
    });
    return { status: "success", data };
  } catch (error) {
    console.error("updateStudentInternship error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function deleteStudentInternship(id) {
  try {
    const data = await prisma.studentInternship.delete({ where: { id } });
    return { status: "success", data };
  } catch (error) {
    console.error("deleteStudentInternship error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

/* ---------------------- Job (New) ---------------------- */
async function createJob(
  companyId,
  jobTitle,
  jobDescription,
  requiredSkillsText,
  eligibilityCgpa,
  eligibilityBranches,
  ctcPaLakhs
) {
  try {
    const data = await prisma.job.create({
      data: {
        company: {
          connect: { id: companyId },
        },
        jobTitle,
        jobDescription,
        requiredSkillsText,
        eligibilityCgpa,
        eligibilityBranches,
        ctcPaLakhs,
      },
    });
    return { status: "success", data };
  } catch (error) {
    console.error("createJob error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function getJobById(id) {
  try {
    const data = await prisma.job.findUnique({
      where: { id },
      include: { company: true, applications: true },
    });
    return { status: "success", data };
  } catch (error) {
    console.error("getJobById error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function getAllJobs() {
  try {
    const data = await prisma.job.findMany({
      include: { company: true },
    });
    return { status: "success", data };
  } catch (error) {
    console.error("getAllJobs error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function updateJob(
  id,
  jobTitle,
  jobDescription,
  requiredSkillsText,
  eligibilityCgpa,
  eligibilityBranches,
  ctcPaLakhs,
  status
) {
  try {
    const data = await prisma.job.update({
      where: { id },
      data: {
        jobTitle,
        jobDescription,
        requiredSkillsText,
        eligibilityCgpa,
        eligibilityBranches,
        ctcPaLakhs,
        status,
      },
    });
    return { status: "success", data };
  } catch (error) {
    console.error("updateJob error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function deleteJob(id) {
  try {
    const data = await prisma.job.delete({ where: { id } });
    return { status: "success", data };
  } catch (error) {
    console.error("deleteJob error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

/* ---------------------- Drive (Updated) ---------------------- */
async function createDrive(
  tnpAdminId,
  driveTitle,
  startDate,
  endDate,
  status,
  jobIds = []
) {
  try {
    const data = await prisma.drive.create({
      data: {
        tnpAdminId,
        driveTitle,
        startDate,
        endDate,
        status,
        jobs: {
          connect: jobIds.map((id) => ({ id })),
        },
      },
    });
    return { status: "success", data };
  } catch (error) {
    console.error("createDrive error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function getDriveById(id) {
  try {
    const data = await prisma.drive.findUnique({
      where: { id },
      include: { tnpAdmin: true, jobs: true },
    });
    return { status: "success", data };
  } catch (error) {
    console.error("getDriveById error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function getAllDrives() {
  try {
    const data = await prisma.drive.findMany({
      include: { tnpAdmin: true, jobs: true },
    });
    return { status: "success", data };
  } catch (error) {
    console.error("getAllDrives error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function updateDrive(
  id,
  driveTitle,
  startDate,
  endDate,
  status,
  jobIds = []
) {
  try {
    const data = await prisma.drive.update({
      where: { id },
      data: {
        driveTitle,
        startDate,
        endDate,
        status,
        jobs: {
          set: jobIds.map((id) => ({ id })), // `set` replaces the existing list of jobs
        },
      },
    });
    return { status: "success", data };
  } catch (error) {
    console.error("updateDrive error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function deleteDrive(id) {
  try {
    const data = await prisma.drive.delete({ where: { id } });
    return { status: "success", data };
  } catch (error) {
    console.error("deleteDrive error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

/* ---------------------- Application (New) ---------------------- */
async function createApplication(studentId, jobId) {
  try {
    const data = await prisma.application.create({
      data: { studentId, jobId },
    });
    return { status: "success", data };
  } catch (error) {
    // Handle unique constraint violation (student already applied)
    if (error.code === "P2002") {
      return {
        status: "error",
        message: "Student has already applied to this job.",
      };
    }
    console.error("createApplication error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function getApplicationById(id) {
  try {
    const data = await prisma.application.findUnique({
      where: { id },
      include: { student: true, job: true },
    });
    return { status: "success", data };
  } catch (error) {
    console.error("getApplicationById error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function getApplicationsByJobId(jobId) {
  try {
    const data = await prisma.application.findMany({
      where: { jobId },
      include: { student: { include: { user: true } } },
    });
    return { status: "success", data };
  } catch (error) {
    console.error("getApplicationsByJobId error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function getApplicationsByJobIdAndStatus(jobId, status) {
  try {
    const data = await prisma.application.findMany({
      where: { jobId, status },
      include: { student: { include: { user: true } } },
    });
    return { status: "success", data };
  } catch (error) {
    console.error("getApplicationsByJobId error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function updateApplicationStatus(app_id, status) {
  try {
    const data = await prisma.application.update({
      where: { id: app_id },
      data: { status },
    });
    return { status: "success", data };
  } catch (error) {
    console.error("updateApplicationStatus error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

async function deleteApplication(id) {
  try {
    const data = await prisma.application.delete({ where: { id } });
    return { status: "success", data };
  } catch (error) {
    console.error("deleteApplication error:", error);
    return { status: "error", message: error?.message || "Unexpected error" };
  }
}

/* ---------------------- Auth Function ---------------------- */
const login = async (req, res) => {
  try {
    const { id, pw } = req.body;

    if (!id || !pw) {
      return res.status(400).json({ message: "ID and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { id: id } });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(pw, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      id: user.id,
      role: user.role,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          message: "Logged in successfully",
          token: token,
          user: { id: user.id, role: user.role, email: user.email },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

async function uploadResume(req, res) {
  const { id } = req.body;

  if (!req.file) {
    return { error: "No file uploaded" };
  }

  try {
    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) {
      return { error: `Student with id ${id} does not exist` };
    }
    const formData = new FormData();
    formData.append("file", req.file.buffer, req.file.originalname);

    const aiResponse = await axios.post(
      `${Flask_API}/api/ai/parse-resume`,
      formData,
      { headers: formData.getHeaders() }
    );

    const resumeText = aiResponse.data.text;
    console.log(resumeText);
    await prisma.resume.upsert({
      where: { studentId: id },
      update: { data: req.file.buffer, resumeText: resumeText },
      create: {
        studentId: id,
        data: req.file.buffer,
        resumeText: resumeText,
      },
    });

    return {
      status: "success",
      message: "Resume uploaded and parsed successfully!",
      parsedText: resumeText,
    };
  } catch (e) {
    console.error(e);
    return {
      status: "error",
      message: "Internal Server Error",
    };
  }
}

async function downloadResume(studentId) {
  const resume = await prisma.resume.findUnique({
    where: { studentId: studentId },
  });

  return resume;
}

async function rankStudents(jobId) {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) {
    return { status: "error", message: "Invalid job ID" };
  }

  // Make sure eligibilityBranches is an array if it exists
  let branches = [];
  if (job.eligibilityBranches) {
    if (Array.isArray(job.eligibilityBranches)) {
      branches = job.eligibilityBranches;
    } else if (typeof job.eligibilityBranches === "string") {
      branches = job.eligibilityBranches.split(",").map(b => b.trim());
    }
  }

  let eligibleStudents = await prisma.student.findMany({
    include: {
      resume: true,
      user: true, // include email if needed
    },
    where: {
      cgpa: {
        gte: job.eligibilityCgpa || 0,
      },
      ...(branches.length > 0 && { branch: { in: branches } }),
    },
  });

  const rankedStudents = eligibleStudents.map(student => {
    let score = 0;

    if (job.eligibilityCgpa && student.cgpa) {
      score += Math.min(student.cgpa / job.eligibilityCgpa, 1) * 50;
    }

    if (student.resume?.resumeText && job.requiredSkillsText) {
      const studentWords = student.resume.resumeText
        .toLowerCase()
        .match(/\b\w+\b/g) || [];

      const requiredSkills = job.requiredSkillsText
        .split(",")
        .map(s => s.trim().toLowerCase())
        .filter(Boolean);

      if (requiredSkills.length > 0) {
        const matched = requiredSkills.filter(skill =>
          studentWords.includes(skill)
        ).length;

        score += (matched / requiredSkills.length) * 30;
      }
    }

    return {
      id: student.id,
      name: student.fullName,
      email: student.user.email,
      score,
    };
  });

  rankedStudents.sort((a, b) => b.score - a.score);

  return {
    status: "success",
    jobId,
    rankedStudents,
  };
}


module.exports = {
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
  getApplicationsByJobIdAndStatus,
  updateApplicationStatus,
  deleteApplication,

  // Auth function
  login,

  // upload resume
  uploadResume,

  // download resume
  downloadResume,
  rankStudents,
};
