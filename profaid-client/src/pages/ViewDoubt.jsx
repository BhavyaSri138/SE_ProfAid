import { useEffect, useState } from "react";
import { FaFileAlt, FaUserCircle } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import ProfessorNavbar from "../components/ProfessorNavbar";
import StudentNavbar from "../components/StudentNavbar";

const ViewDoubt = () => {
  const { doubtID } = useParams();
  const [doubt, setDoubt] = useState(null);
  const [user, setUser] = useState({ ID: "", role: "" });
  const [loading, setLoading] = useState(true);
  const [extensionDescription, setExtensionDescription] = useState("");
  const [extensionFiles, setExtensionFiles] = useState([]);
  const [extendMode, setExtendMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const ID = localStorage.getItem("ID") || "";
    const role = localStorage.getItem("role") || "";
    setUser({ ID, role });

    const fetchDoubt = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/doubts/${doubtID}`);
        const data = await res.json();

        if (res.ok) {
          setDoubt(data);
        } else {
          console.error("Error fetching doubt:", data.message);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoubt();
  }, [doubtID]);

  const handleClarified = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/doubts/clarify/${doubtID}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Status: "Clarified" }),
      });

      if (res.ok) {
        const updatedDoubt = await res.json();
        setDoubt(updatedDoubt);
        alert("Doubt marked as Clarified...");
        navigate(user.role === "Student" ? "/my-doubts" : "/professor-dashboard");
      } else {
        console.error("Failed to mark as clarified");
      }
    } catch (err) {
      console.error("Clarify Error:", err);
    }
  };

  const handleExtendOrReply = async () => {
  if (!extensionDescription.trim()) {
    alert("Description cannot be empty.");
    return;
  }

  const formData = new FormData();
  formData.append("Message", extensionDescription);
  formData.append("SenderID", user.ID);

  for (let i = 0; i < extensionFiles.length; i++) {
    formData.append("Files", extensionFiles[i]);
  }

  const apiUrl = user.role === "Professor"
    ? `http://localhost:5000/api/doubts/reply/${doubtID}`
    : `http://localhost:5000/api/doubts/extend/${doubtID}`;

  try {
    const res = await fetch(apiUrl, {
      method: "PATCH",
      body: formData,
    });

    if (res.ok) {
      const updatedDoubt = await res.json();
      setDoubt(updatedDoubt);
      alert(user.role === "Professor" ? "Reply sent successfully." : "Extension submitted successfully.");
      setExtensionDescription("");
      setExtensionFiles([]);
      setExtendMode(false);
    } else {
      console.error("Failed to submit extension/reply");
    }
  } catch (err) {
    console.error("Extend/Reply Error:", err);
  }
};
  if (loading) return <p>Loading...</p>;
  if (!doubt) return <p>Doubt not found.</p>;

  const isStudent = user.role === "Student";
  const isProfessor = user.role === "Professor";

  return (
    <div>
      {isStudent ? <StudentNavbar /> : isProfessor ? <ProfessorNavbar /> : null}

      <div style={{ margin: "20px" }}>
        <h2>{doubt.Title}</h2>
        <p><strong>Description:</strong></p>
        <p>{doubt.Description}</p>

        <p style={{ fontStyle: "italic", color: "gray" }}>
          Posted by: {user.ID === doubt.StudentID ? "You" : doubt.StudentID}
        </p>

        {doubt.FilesAttached?.length > 0 && (
          <div>
            <h4>Attached Files:</h4>
            {doubt.FilesAttached.map((file, idx) => (
              <div key={idx}>
                <a href={`http://localhost:5000/uploads/${file}`} target="_blank" rel="noreferrer">
                  <FaFileAlt /> {file}
                </a>
              </div>
            ))}
          </div>
        )}

        {doubt.Replies?.length === 0 ? (
          <p>No replies yet.</p>
        ) : (
          doubt.Replies.map((reply, idx) => (
            <div key={idx} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "10px", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <FaUserCircle size={24} />
                <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
                  {reply.SenderID === user.ID
                    ? "You"
                    : reply.SenderID.startsWith("P")
                    ? "Professor"
                    : reply.SenderID}
                </span>
              </div>
              <p>{reply.Message}</p>
              <small>{new Date(reply.RepliedAt).toLocaleString()}</small>
              {reply.FilesAttached?.length > 0 && (
                <div>
                  {reply.FilesAttached.map((file, idx2) => (
                    <div key={idx2}>
                      <a href={`http://localhost:5000/uploads/${file}`} target="_blank" rel="noreferrer">
                        <FaFileAlt /> {file}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}

        {/* Student clarification & extension */}
        {isStudent && user.ID === doubt.StudentID && doubt.Status !== "Clarified" && (
          <div style={{ marginTop: "20px" }}>
            <h3>Is Your Doubt Clarified?</h3>
            <button onClick={handleClarified} style={{ marginRight: "10px", padding: "10px 20px", backgroundColor: "green", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
              Yes
            </button>
            <button onClick={() => setExtendMode(true)} style={{ padding: "10px 20px", backgroundColor: "orange", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
              No
            </button>
          </div>
        )}

        {/* Extension / Reply Form */}
        {((isStudent && extendMode) || isProfessor) && doubt.Status !== "Clarified" && (
          <div style={{ marginTop: "20px" }}>
            <textarea
              value={extensionDescription}
              onChange={(e) => setExtensionDescription(e.target.value)}
              placeholder={isStudent ? "Add more details..." : "Write your reply here..."}
              rows={4}
              style={{ width: "100%", padding: "10px", borderRadius: "6px" }}
            />
            <input
              type="file"
              multiple
              onChange={(e) => setExtensionFiles(e.target.files)}
              style={{ marginTop: "10px" }}
            />
            <button
              onClick={handleExtendOrReply}
              style={{ marginTop: "10px", padding: "10px 20px", backgroundColor: "blue", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
            >
              Submit {isStudent ? "Extension" : "Reply"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDoubt;
