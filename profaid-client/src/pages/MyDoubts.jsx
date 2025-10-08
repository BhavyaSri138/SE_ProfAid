import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentNavbar from "../components/StudentNavbar";

const MyDoubts = () => {
  const [studentID, setStudentID] = useState("");
  const [doubts, setDoubts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const ID = localStorage.getItem("ID") || "";
    setStudentID(ID);

    const fetchDoubts = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/doubts/student/${ID}`);
        const data = await res.json();

        if (res.ok) {
          setDoubts(data);
        } else {
          console.error("Failed to fetch doubts:", data.message);
        }
      } catch (err) {
        console.error("Error fetching doubts:", err);
      }
    };

    if (ID) fetchDoubts();
  }, []);

  return (
    <div>
      <StudentNavbar/>

      <div style={{ maxWidth: "800px", margin: "30px auto" }}>
        <h2>My Doubts</h2>
        {doubts.length === 0 ? (
          <p>No doubts posted yet.</p>
        ) : (
          doubts.map((doubt) => (
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
              <p><strong>Created At:</strong> {new Date(doubt.CreatedAt).toLocaleString()}</p>
              <p><strong>Status:</strong> {doubt.Status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyDoubts;
