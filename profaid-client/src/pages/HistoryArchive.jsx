import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentNavbar from "../components/StudentNavbar";

const HistoryArchive = () => {
  const [student, setStudent] = useState({ StudentID: "", Branch: "" });
  const [doubts, setDoubts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const StudentID = localStorage.getItem("ID") || "";
    const Branch = localStorage.getItem("Branch") || "";
    setStudent({ StudentID, Branch });
    const fetchDoubts = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/doubts/branch/${Branch}/${StudentID}`
        );
        const data = await res.json();
        if (res.ok) {
          const clarifiedDoubts = data.filter((doubt) => doubt.Status === "Clarified");
          setDoubts(clarifiedDoubts);
        } else {
          console.error("Error fetching doubts:", data.message);
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    if (Branch && StudentID) fetchDoubts();
  }, []);

  return (
    <div>
      <StudentNavbar/>
      {/* History Archive Section */}
      <div style={{ margin: "20px" }}>
        <h2>History Archive</h2>
        {doubts.length === 0 ? (
          <p>No historical doubts available 🎉</p>
        ) : (
          doubts.map((doubt) => (
            <div
              key={doubt._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "10px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/view-doubt/${doubt.DoubtID}`)}
            >
              <h4>{doubt.Subject}</h4>
              <p><strong>{doubt.Title}</strong></p>
              <small>Created: {new Date(doubt.CreatedAt).toLocaleString()}</small><br />
              <small>Student ID: {doubt.StudentID}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryArchive;
