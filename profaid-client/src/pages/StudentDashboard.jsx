import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentNavbar from "../components/StudentNavbar";

// Import Bootstrap components
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap"; 
// ... (imports and component logic remain the same)

// --- Custom Styles (ProfAid Theme) ---
const customStyles = `
  /* 1. Full-Screen Gradient Background (Warm Sunset) - Now applies to the outermost div */
  .prof-aid-bg {
    background: linear-gradient(135deg, #FF7B54 0%, #FFB547 50%, #FFD28A 100%);
    min-height: 100vh;
    color: #333333; 
  }
  
  /* 2. Primary Accent Color (Coral/Button color) */
  .btn-prof-aid, .btn-prof-aid:hover, .btn-prof-aid:focus {
    background-color: #FF7B54 !important; 
    border-color: #FF7B54 !important;
    color: white !important;
    font-weight: 600;
  }
  
  /* 3. Deep Accent Color (Burnt Orange for Titles/Emphasis) */
  .prof-aid-text-accent {
      color: #D84315 !important; 
  }
  
  /* --- Component Specific Styles Mapped to ProfAid Theme --- */
  
  .dashboard-page {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 15px;
    /* 🎯 FIX 1: Add substantial padding at the top to clear the fixed navbar */
    padding-top: 80px; /* Adjust this value (e.g., 80px) to match your Navbar's height */
    padding-bottom: 20px;
  }

  .welcome-box {
    /* 🎯 FIX 2: Removed margin-top, letting the parent's padding handle clearance */
    /* margin-top: 20px; <--- REMOVED */
    background: rgba(255, 255, 255, 0.2); 
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 30px;
    color: white; 
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  .welcome-box h2 {
      font-weight: 700;
      color: white;
  }

  /* Links section adjusted to use Bootstrap's standard flex/gap utils */
  .links-section {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 30px;
  }

  .links-section .card, .doubts-section .doubt-card {
    background-color: white;
    border: none;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    flex-grow: 1;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .links-section .card:hover, .doubts-section .doubt-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  .links-section h3 {
      color: #FF7B54; 
      font-weight: 600;
  }

  .ask-btn {
    width: 100%;
    padding: 15px;
    border: none;
    border-radius: 8px;
    font-size: 1.2rem;
    cursor: pointer;
    margin-bottom: 30px;
    background-color: #D84315; 
    color: white;
    font-weight: bold;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  }

  .doubts-section h2 {
      color: #D84315; 
      margin-bottom: 20px;
      font-weight: 600;
  }

  .doubt-card h4 {
      color: #FF7B54; 
      font-weight: 600;
  }

  .no-doubts {
      padding: 20px;
      background: #fffaf0; 
      border-radius: 8px;
      text-align: center;
      color: #555;
  }
`;

const StudentDashboard = () => {
  // ... (rest of the component logic remains unchanged)
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    ID: "",
    Name: "",
    Email: "",
    Branch: "",
  });

  const [unclarifiedDoubts, setUnclarifiedDoubts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper for API calls (kept clean)
  const handleApiCall = async (url) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "API call failed");
      }
      return data;
    } catch (err) {
      console.error("API Error:", err);
      // Removed alert/error state for brevity, keeping only console logging
      return null;
    }
  };


  useEffect(() => {
    const ID = localStorage.getItem("ID") || "";
    const Name = localStorage.getItem("Name") || "";
    const Email = localStorage.getItem("Email") || "";
    const Branch = localStorage.getItem("Branch") || "";

    setStudent({ ID, Name, Email, Branch });

    const fetchUnclarifiedDoubts = async () => {
      if (!ID) return;
      setLoading(true);
      
      const data = await handleApiCall(`http://localhost:5000/api/doubts/student/${ID}`);

      if (data) {
        const filtered = data.filter((doubt) => doubt.Status !== "Clarified");
        setUnclarifiedDoubts(filtered);
      } else {
         setUnclarifiedDoubts([]);
      }
      setLoading(false);
    };

    if (ID) fetchUnclarifiedDoubts();
    else setLoading(false);
  }, []);
  
  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center prof-aid-bg" style={{height: "100vh"}}>
        <Spinner animation="border" variant="light" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );


  return (
    <div className="prof-aid-bg">
      <style>{customStyles}</style>
      
      {/* Navbar is fixed and transparent over the gradient */}
      <StudentNavbar />
      
      <Container>
        {/* The padding-top in .dashboard-page CSS pushes this content down */}
        <div className="dashboard-page"> 
          
          <div className="welcome-box">
            <h2>👋 Welcome, {student.Name || "Student"}!</h2>
            <p>
              <strong>Branch:</strong> {student.Branch || "N/A"} |{" "}
              <strong>Email:</strong> {student.Email || "N/A"}
            </p>
          </div>

          <div className="links-section">
            <div
              className="card"
              onClick={() => navigate("/my-doubts")}
            >
              <h3>🧠 My Doubts</h3>
              <p>See all the doubts you’ve posted.</p>
            </div>

            <div
              className="card"
              onClick={() => navigate("/history-archive")}
            >
              <h3>📚 History Archive</h3>
              <p>Check all clarified doubts in your department.</p>
            </div>
          </div>

          <button className="ask-btn" onClick={() => navigate("/ask-doubt")}>
            ✨ Ask a Doubt
          </button>

          <div className="doubts-section">
            <h2>❓ Unclarified Doubts</h2>
            {unclarifiedDoubts.length === 0 ? (
              <p className="no-doubts">🎉 No unclarified doubts yet!</p>
            ) : (
              unclarifiedDoubts.map((doubt) => (
                <div
                  key={doubt._id}
                  className="doubt-card"
                  onClick={() => navigate(`/view-doubt/${doubt.DoubtID}`)}
                >
                  <h4>💡 {doubt.Title}</h4>
                  <p>
                    <strong>📘 Subject:</strong> {doubt.Subject}
                  </p>
                  <small>🕒 {new Date(doubt.CreatedAt).toLocaleString()}</small>
                </div>
              ))
            )}
          </div>
        </div>
      </Container>
      <footer className="w-100 py-3 text-center text-white small" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', marginTop: 'auto' }}>
              <Container>
                <p className="mb-0" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
                  &copy; {new Date().getFullYear()} Profaid EdTech Platform. All rights reserved.
                </p>
              </Container>
            </footer>
    </div>
  );
};

export default StudentDashboard;