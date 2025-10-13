import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfessorNavbar from "../components/ProfessorNavbar";

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
  
  /* 3. Primary Color (Coral for Headers) */
  .prof-aid-primary-color {
      color: #FF7B54 !important;
  }

  /* --- Component Specific Styles Mapped to ProfAid Theme --- */
  
  .dashboard-container {
    /* 🎯 FIX: Padding-top to clear the fixed Navbar and prevent overlap */
    padding-top: 80px; 
    max-width: 1100px;
    margin: 0 auto;
    padding-left: 15px;
    padding-right: 15px;
  }

  .dashboard-title {
    color: white; /* White text for main title */
    font-weight: 700;
    margin-bottom: 30px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    font-size: 2.5rem;
  }
  
  .professor-info {
      /* Info card/box using light transparent background */
      background: rgba(255, 255, 255, 0.2); 
      padding: 15px;
      border-radius: 10px;
      margin-bottom: 20px;
      color: white; 
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  }

  .section-title {
    font-weight: 700;
    font-size: 2rem;
    color: #D84315; /* Deep accent for section title */
    margin-top: 30px;
    margin-bottom: 25px;
  }

  /* Styling for the doubt cards (Clean White/Yellow Tones) */
  .doubt-card {
    background-color: white; /* Default white background */
    border: none;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-bottom: 15px;
    cursor: pointer;
    border-left: 5px solid #FFB547; /* Mid-tone yellow stripe */
    transition: transform 0.2s, background-color 0.2s;
  }
  
  .doubt-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
      background-color: #fffaf0; /* Very light cream on hover */
  }

  .doubt-card h4 {
      color: #D84315; /* Deep accent for subject/title */
      font-weight: 600;
      margin-bottom: 10px;
  }
  
  .doubt-card p {
      margin-bottom: 5px;
      font-size: 0.95rem;
  }

  .no-doubts {
      padding: 20px;
      background: rgba(255, 255, 255, 0.9); /* Slightly transparent white */
      border-radius: 8px;
      text-align: center;
      color: #555;
      font-weight: 500;
  }
`;

const ProfessorDashboard = () => {
  const navigate = useNavigate();
  const [professor, setProfessor] = useState({ ProfessorID: "", Subjects: [] });
  const [unclarifiedDoubts, setUnclarifiedDoubts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper for consistent API calls
  const handleApiCall = async (url) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(url, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "API call failed");
      }
      return data;
    } catch (err) {
      console.error("API Error:", err);
      return null;
    }
  };

  useEffect(() => {
    const ProfessorID = localStorage.getItem("ID") || "";
    setProfessor((prev) => ({ ...prev, ProfessorID }));

    const fetchProfessorData = async () => {
      setLoading(true);
      
      const detailsData = await handleApiCall(`http://localhost:5000/api/professors/${ProfessorID}`);

      if (detailsData) {
        setProfessor({ ProfessorID: detailsData.ProfessorID, Subjects: detailsData.Subjects });

        const subjectsQuery = detailsData.Subjects.join(",");
        const doubtsData = await handleApiCall(
          `http://localhost:5000/api/doubts/unclarified?subjects=${subjectsQuery}`
        );

        if (doubtsData) setUnclarifiedDoubts(doubtsData);
        else setUnclarifiedDoubts([]);
      }
      setLoading(false);
    };

    if (ProfessorID) fetchProfessorData();
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
      <ProfessorNavbar />

      <Container className="dashboard-container">
        <h2 className="dashboard-title">
          🎓 Professor Dashboard <span>— Guiding Bright Minds 💡</span>
        </h2>

        <div className="professor-info">
          <p>👩‍🏫 <strong>Professor ID:</strong> {professor.ProfessorID}</p>
          <p>📘 <strong>Subjects:</strong> {professor.Subjects.join(", ") || "No subjects assigned"}</p>
        </div>

        <h3 className="section-title">📚 Unclarified Doubts</h3>

        {unclarifiedDoubts.length === 0 ? (
          <p className="no-doubts">✨ No unclarified doubts — Keep inspiring your students! 🌟</p>
        ) : (
          unclarifiedDoubts.map((doubt) => (
            <div
              key={doubt._id}
              className="doubt-card"
              onClick={() => navigate(`/view-doubt/${doubt.DoubtID}`)}
            >
              <h4>📖 Subject: {doubt.Subject}</h4>
              <p><strong>🧩 Title:</strong> {doubt.Title}</p>
              <p><strong>💬 Description:</strong> {doubt.Description}</p>
              <p><strong>🕒 Created At:</strong> {new Date(doubt.CreatedAt).toLocaleString()}</p>
              <p><strong>⚙️ Status:</strong> {doubt.Status}</p>
              <p><strong>🎓 Student ID:</strong> {doubt.StudentID}</p>
            </div>
          ))
        )}
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

export default ProfessorDashboard;