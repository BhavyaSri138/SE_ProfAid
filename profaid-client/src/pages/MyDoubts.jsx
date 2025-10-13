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
  
  .mydoubts-page {
    /* Padding-top to clear the fixed Navbar */
    padding-top: 80px; 
    max-width: 900px;
    margin: 0 auto;
    padding-left: 15px;
    padding-right: 15px;
  }

  .my-doubts-box {
    background: rgba(255, 255, 255, 0.9); /* Slightly transparent white for the main container */
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  .my-doubts-box .title {
    color: #D84315; /* Deep Accent for the main title */
    font-weight: 700;
    margin-bottom: 25px;
  }

  .empty-text {
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
    border-left: 5px solid #FF7B54; /* Coral stripe */
    border-radius: 8px;
    padding: 15px;
    cursor: pointer;
    transition: background-color 0.2s, box-shadow 0.2s;
  }

  .doubt-list .doubt-card:hover {
      background-color: #fff8f5; /* Very light coral on hover */
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

const MyDoubts = () => {
  const [studentID, setStudentID] = useState("");
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const navigate = useNavigate();

  useEffect(() => {
    const ID = localStorage.getItem("ID") || "";
    setStudentID(ID);

    const fetchDoubts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`http://localhost:5000/api/doubts/student/${ID}`, {
             headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        if (res.ok) {
          // Sort by CreatedAt descending (newest first)
          const sortedDoubts = data.sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
          setDoubts(sortedDoubts);
        } else {
          console.error("Failed to fetch doubts:", data.message);
        }
      } catch (err) {
        console.error("Error fetching doubts:", err);
      } finally {
        setLoading(false);
      }
    };

    if (ID) fetchDoubts();
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
        <div className="mydoubts-page">
          <div className="my-doubts-box">
            <h2 className="title">🧠 My Doubts</h2>

            {doubts.length === 0 ? (
              <p className="empty-text">😇 You haven’t posted any doubts yet.</p>
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
                    <p>
                      <strong>🕒 Created At:</strong>{" "}
                      {new Date(doubt.CreatedAt).toLocaleString()}
                    </p>
                    <p>
                      <strong className="prof-aid-primary-color">📊 Status:</strong>{" "}
                      <span 
                          // Style status based on its value
                          style={{ 
                              color: doubt.Status === 'Clarified' ? 'green' : (doubt.Status === 'Pending' ? '#FF7B54' : '#D84315'), 
                              fontWeight: 'bold' 
                          }}
                      >
                          {doubt.Status}
                      </span>
                    </p>
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

export default MyDoubts;