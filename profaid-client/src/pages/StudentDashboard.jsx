import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentNavbar from "../components/StudentNavbar";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    ID: "",
    Name: "",
    Email: "",
    Branch: "",
  });

  const [unclarifiedDoubts, setUnclarifiedDoubts] = useState([]);

  useEffect(() => {
    const ID = localStorage.getItem("ID") || "";
    const Name = localStorage.getItem("Name") || "";
    const Email = localStorage.getItem("Email") || "";
    const Branch = localStorage.getItem("Branch") || "";

    setStudent({ ID, Name, Email, Branch });

    const fetchUnclarifiedDoubts = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/doubts/student/${ID}`);
        const data = await res.json();

        if (res.ok) {
          // Filter only doubts where Status is not "Clarified"
          const filtered = data.filter((doubt) => doubt.Status !== "Clarified");
          setUnclarifiedDoubts(filtered);
        } else {
          console.error("Failed to fetch doubts:", data.message);
        }
      } catch (err) {
        console.error("Error fetching doubts:", err);
      }
    };

    if (ID) fetchUnclarifiedDoubts();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div>
      <StudentNavbar />

      {/* Links Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "20px",
        }}
      >
        <div
          style={{
            flex: 1,
            margin: "10px",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            cursor: "pointer",
            textAlign: "center",
            background: "#7f1515ff",
          }}
          onClick={() => navigate("/my-doubts")}
        >
          <h3>My Doubts</h3>
          <p>See all the doubts you posted</p>
        </div>

        <div
          style={{
            flex: 1,
            margin: "10px",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            cursor: "pointer",
            textAlign: "center",
            background: "#a10909ff",
          }}
          onClick={() => navigate("/history-archive")}
        >
          <h3>History Archive</h3>
          <p>Check all doubts posted by other students in your department</p>
        </div>
      </div>

      {/* Unclarified Doubts Section */}
      <div style={{ margin: "20px" }}>
        <h2>Unclarified Doubts</h2>
        {unclarifiedDoubts.length === 0 ? (
          <p>No unclarified doubts 🎉</p>
        ) : (
          unclarifiedDoubts.map((doubt) => (
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
              <small style={{ color: "gray" }}>{new Date(doubt.CreatedAt).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => navigate("/ask-doubt")}
        style={{
          marginTop: "20px",
          background: "#1976d2",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        + Ask a Doubt
      </button>
    </div>
  );
};

export default StudentDashboard;
