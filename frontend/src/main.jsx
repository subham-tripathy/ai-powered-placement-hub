// import "./index.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Company from "./components/Company";
import Admin from "./components/Admin";
import Student from "./components/Student";
import Drive from "./components/Drive";
import StudentEducationDetails from "./components/StudentEducationDetails";
import StudentAchievementsDetails from "./components/StudentAchievementsDetails";
import StudentInternshipDetails from "./components/StudentInternshipDetails";
import PlacementDetails from "./components/PlacementDetails";
import Login from "./components/Login";
import LoginContextProvider from "./components/ContextProvider";
import NavBar from "./components/NavBar";
import Job from "./components/Job";
import UploadResume from "./components/UploadResume";
import RankJob from "./components/RankJob";
import App from "./App";
import MockInterview from "./components/MockInterview";
import ProfilePage from "./components/Profile";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <ToastContainer />
    <LoginContextProvider>
      <NavBar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/mockinterview" element={<MockInterview />} />
        <Route path="/rankjob/:id" element={<RankJob />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admins" element={<Admin />} />
        <Route path="/companies" element={<Company />} />
        <Route path="/students" element={<Student />} />
        <Route path="/drives" element={<Drive />} />
        <Route path="/jobs" element={<Job />} />
        <Route path="/uploadresume" element={<UploadResume />} />
        <Route
          path="/student-education"
          element={<StudentEducationDetails />}
        />
        <Route
          path="/student-achievements"
          element={<StudentAchievementsDetails />}
        />
        <Route
          path="/student-internships"
          element={<StudentInternshipDetails />}
        />
        <Route path="/placements" element={<PlacementDetails />} />
      </Routes>
    </LoginContextProvider>
  </BrowserRouter>
);
