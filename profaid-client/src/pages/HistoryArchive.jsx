import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentNavbar from "../components/StudentNavbar";

// Import Bootstrap components for better styling utility
import { Container, Spinner } from "react-bootstrap"; 

// --- Custom Styles (ProfAid Theme) ---
const customStyles = `
  /* 1. Full-Screen Gradient Background (Warm Sunset) */
  .prof-aid-bg {
    background: linear-gradient(135deg, #FF7B54 0%, #FFB547 50%, #FFD28A 100%);
    min-height: 100vh;
    color: #333333; 
  }
  
  /* 2. Deep Accent Color (Burnt Orange for Titles/Emphasis) */
  .prof-aid-text-accent {
      color: #D84315 !important; 
  }
  
  /* 3. Primary Color (Coral for Status/Headers) */
  .prof-aid-primary-color {
      color: #FF7B54 !important;
  }

  /* --- Component Specific Styles Mapped to ProfAid Theme --- */
  
  .history-page {
    /* Padding-top to clear the fixed Navbar */
    padding-top: 80px; 
    max-width: 900px;
    margin: 0 auto;
    padding-left: 15px;
    padding-right: 15px;
  }

  .history-box {
    background: rgba(255, 255, 255, 0.9); /* Slightly transparent white for the main container */
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  .history-box .title {
    color: #D84315; /* Deep Accent for the main title */
    font-weight: 700;
    margin-bottom: 25px;
  }

  .no-doubts {
      padding: 20px;
      background: #fffaf0; /* Light cream background */
      border-radius: 8px;
      text-align: center;
      color: #555;
      font-weight: 500;
  }

  .doubt-list {
      display: grid;
      gap: 15px;
  }

  .doubt-list .doubt-card {
    background-color: white;
    border: 1px solid #FFB547; /* Mid-tone accent border */
    border-left: 5px solid #00AA00; /* Green stripe for CLARIFIED status */
    border-radius: 8px;
    padding: 15px;
    cursor: pointer;
    transition: background-color 0.2s, box-shadow 0.2s;
  }

  .doubt-list .doubt-card:hover {
      background-color: #f6fff6; /* Very light green on hover for clarity */
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .doubt-card h4 {
      color: #D84315; /* Deep accent for doubt titles */
      font-weight: 600;
      margin-bottom: 8px;
  }

  .doubt-card p {
      margin-bottom: 4px;
      font-size: 0.95rem;
  }
`;

const HistoryArchive = () => {
  const [student, setStudent] = useState({ StudentID: "", Branch: "" });
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const StudentID = localStorage.getItem("ID") || "";
    const Branch = localStorage.getItem("Branch") || "";
    setStudent({ StudentID, Branch });

    const fetchDoubts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(
          `http://localhost:5000/api/doubts/branch/${Branch}/${StudentID}`, {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        const data = await res.json();
        
        if (res.ok) {
          // Filter and sort by creation date (newest first)
          const clarifiedDoubts = data.filter(
            (doubt) => doubt.Status === "Clarified"
          ).sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
          
          setDoubts(clarifiedDoubts);
        } else {
          console.error("Error fetching doubts:", data.message);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
          setLoading(false);
      }
    };

    if (Branch && StudentID) fetchDoubts();
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
    // Apply the main ProfAid background class
    <div className="prof-aid-bg">
      <style>{customStyles}</style>
      <StudentNavbar />
      
      <Container>
        <div className="history-page">
          <div className="history-box">
            <h2 className="title">📚 History Archive</h2>

            {doubts.length === 0 ? (
              <p className="no-doubts">🎉 No historical doubts available yet!</p>
            ) : (
              <div className="doubt-list">
                {doubts.map((doubt) => (
                  <div
                    key={doubt._id}
                    className="doubt-card"
                    onClick={() => navigate(`/view-doubt/${doubt.DoubtID}`)}
                  >
                    <h4 className="prof-aid-text-accent">💡 {doubt.Title}</h4>
                    <p>
                      <strong>📘 Subject:</strong> {doubt.Subject}
                    </p>
                    <small>🕒 {new Date(doubt.CreatedAt).toLocaleString()}</small>
                    <br />
                    <small>👩‍🎓 Student ID: {doubt.StudentID}</small>
                  </div>
                ))}
              </div>
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

export default HistoryArchive;