import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfessorNavbar from "../components/ProfessorNavbar";

const ProfessorDashboard = () => {
  const navigate = useNavigate();
  const [professor, setProfessor] = useState({ ProfessorID: "", Subjects: [] });
  const [unclarifiedDoubts, setUnclarifiedDoubts] = useState([]);

  useEffect(() => {
    const ProfessorID = localStorage.getItem("ID") || "";
    setProfessor((prev) => ({ ...prev, ProfessorID }));
    // Fetch professor details to get subjects
    const fetchProfessorSubjects = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/professors/${ProfessorID}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
        const data = await res.json();

        if (res.ok) {
          setProfessor({ ProfessorID: data.ProfessorID, Subjects: data.Subjects });

          // Fetch unclarified doubts matching professor subjects
          const subjectsQuery = data.Subjects.join(",");
          const res2 = await fetch(
            `http://localhost:5000/api/doubts/unclarified?subjects=${subjectsQuery}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
          );
          const doubtsData = await res2.json();

          if (res2.ok) {
            setUnclarifiedDoubts(doubtsData);
          } else {
            console.error("Failed to fetch unclarified doubts:", doubtsData.message);
          }
        } else {
          console.error("Failed to fetch professor details:", data.message);
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    if (ProfessorID) fetchProfessorSubjects();
  }, []);

  return (
    <div>
      <ProfessorNavbar />

      <div style={{ maxWidth: "800px", margin: "30px auto" }}>
        <h2>Unclarified Doubts</h2>
        {unclarifiedDoubts.length === 0 ? (
          <p>No unclarified doubts available 🎉</p>
        ) : (
          unclarifiedDoubts.map((doubt) => (
            <div
              key={doubt._id}
              onClick={() => navigate(`/view-doubt/${doubt.DoubtID}`)}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "10px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                cursor: "pointer",
              }}
            >
              <h4>Subject: {doubt.Subject}</h4>
              <p><strong>Title:</strong> {doubt.Title}</p>
              <p><strong>Description:</strong> {doubt.Description}</p>
              <p><strong>Created At:</strong> {new Date(doubt.CreatedAt).toLocaleString()}</p>
              <p><strong>Status:</strong> {doubt.Status}</p>
              <p><strong>Student ID:</strong> {doubt.StudentID}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProfessorDashboard;
