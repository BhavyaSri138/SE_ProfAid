import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import StudentNavbar from "../components/StudentNavbar";
const AskDoubt = () => {
  const [student, setStudent] = useState({ StudentID: "", Branch: "" });
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);

  // Get student info from localStorage
  useEffect(() => {
    const StudentID = localStorage.getItem("ID") || "";
    const Branch = localStorage.getItem("Branch") || "";
  
    setStudent({ StudentID, Branch });

    // Fetch subjects for this branch from backend
    const fetchSubjects = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/subjects?branch=${Branch}`
        );
        const data = await res.json();
        if (res.ok) {
          setSubjects(data); // array of subjects from backend
        } else {
          console.error("Error fetching subjects:", data.message);
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    if (Branch) fetchSubjects();
  }, []);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ Use FormData to send files
      const formData = new FormData();
      formData.append("DoubtID", uuidv4());
      formData.append("StudentID", student.StudentID);
      formData.append("Subject", subject);
      formData.append("Title", title);
      formData.append("Description", description);

      files.forEach((file) => {
        formData.append("files", file); // actual file objects
      });

      const response = await fetch("http://localhost:5000/api/doubts", {
        method: "POST",
        body: formData, // no content-type header here, browser sets it
      });

      const data = await response.json();

      if (response.ok) {
        alert("Doubt submitted successfully!");
        setSubject("");
        setTitle("");
        setDescription("");
        setFiles([]);
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      alert("Error submitting doubt: " + err.message);
    }
  };

  return (
    <div>
      <StudentNavbar/>

      {/* Ask Doubt Form */}
      <div
        style={{
          maxWidth: "600px",
          margin: "30px auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          background: "#7e1515ff",
        }}
      >
        <h2>Ask a Doubt</h2>
        <form onSubmit={handleSubmit}>
          {/* Subject Selection */}
          <label>Subject</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            style={{ display: "block", width: "100%", marginBottom: "10px" }}
          >
            <option value="">-- Select Subject --</option>
            {subjects.map((subj, idx) => (
              <option key={idx} value={subj}>
                {subj}
              </option>
            ))}
          </select>

          {/* Doubt Title */}
          <label>Doubt Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ display: "block", width: "100%", marginBottom: "10px" }}
          />

          {/* Doubt Description */}
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
            style={{ display: "block", width: "100%", marginBottom: "10px" }}
          />

          {/* File Upload */}
          <label>Attach Files</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            style={{ display: "block", marginBottom: "10px" }}
          />

          {/* Submit */}
          <button
            type="submit"
            style={{
              background: "#1976d2",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Submit Doubt
          </button>
        </form>
      </div>
    </div>
  );
};

export default AskDoubt;
