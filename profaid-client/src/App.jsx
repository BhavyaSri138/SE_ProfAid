import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import AskDoubt from "./pages/AskDoubt";
import ChangePassword from "./pages/ChangePassword";
import HistoryArchive from "./pages/HistoryArchive";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ManageProfessors from "./pages/ManageProfessors";
import MyDoubts from "./pages/MyDoubts";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ViewDoubt from "./pages/ViewDoubt";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student-dashboard" element={<StudentDashboard/>}/>
        <Route path="/ask-doubt" element={<AskDoubt />} />
        <Route path="/my-doubts" element={<MyDoubts />} />
        <Route path="/change-password" element={<ChangePassword/>}/>
        <Route path="/history-archive" element={<HistoryArchive />} />     
        <Route path="/view-doubt/:doubtID" element={<ViewDoubt/>}/>
        <Route path="/professor-dashboard" element={<ProfessorDashboard/>}/>
        <Route path="/admin-dashboard" element={<AdminDashboard/>}/>
        <Route path="/manage-professors" element={<ManageProfessors/>}/>
      </Routes>
    </Router>
  );
}

export default App;
