import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import StudentNavbar from "../components/StudentNavbar";

// Import Bootstrap components and icons
import { Container, Form, Button, Row, Col, Card, Alert, Spinner, Toast, ToastContainer } from "react-bootstrap";
import { FaFileAlt, FaPaperPlane, FaQuestionCircle, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'; // Added FaCheck/FaExclamation

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
  
  /* 3. Primary Accent Color (Coral/Button color) */
  .btn-prof-aid, .btn-prof-aid:hover, .btn-prof-aid:focus {
    background-color: #FF7B54 !important; 
    border-color: #FF7B54 !important;
    color: white !important;
    font-weight: 600;
  }
  
  /* 4. Form Container Card (Clean White) */
  .prof-aid-form-card {
    background-color: rgba(255, 255, 255, 0.95);
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  /* 5. Input Styling Focus */
  .form-control:focus, .form-select:focus {
    border-color: #FF7B54 !important;
    box-shadow: 0 0 0 0.25rem rgba(255, 123, 84, 0.25) !important; /* Soft coral shadow */
  }
  
  /* 6. Page Layout */
  .ask-page-wrapper {
      padding-top: 80px; /* Clear the fixed Navbar */
      padding-bottom: 40px;
  }

  .file-list {
    margin-top: 10px;
    padding: 10px;
    background-color: #f8f9fa;
    border-radius: 6px;
  }
`;

// --- Feedback Toast Component ---
const FeedbackToast = ({ show, onClose, title, message, type }) => {
  const HEADER_COLOR = type === 'success' ? '#4CAF50' : '#D84315'; // Green for success, Deep Coral for error
  const ICON = type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />;

  return (
    <ToastContainer position="top-center" style={{ zIndex: 1080, marginTop: '65px' }}>
      <Toast onClose={onClose} show={show} delay={4000} autohide>
        <Toast.Header style={{ backgroundColor: HEADER_COLOR, color: 'white', fontWeight: 'bold' }}>
          {ICON}
          <strong className="me-auto ms-2">{title}</strong>
        </Toast.Header>
        <Toast.Body style={{ color: '#333', backgroundColor: '#fffaf0' }}>
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};
// --- End FeedbackToast Component ---


const AskDoubt = () => {
  const [student, setStudent] = useState({ StudentID: "", Branch: "" });
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🎯 Renaming submitMessage to control the toast
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState({ title: '', message: '', type: 'success' });

  // Helper for API calls (modified to set toast data on error)
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
      setToastData({ title: 'Error', message: `Failed to load data: ${err.message}`, type: 'danger' });
      setShowToast(true);
      return null;
    }
  };


  useEffect(() => {
    const StudentID = localStorage.getItem("ID") || "";
    const Branch = localStorage.getItem("Branch") || "";
    setStudent({ StudentID, Branch });

    const fetchSubjects = async () => {
      setLoading(true);
      const data = await handleApiCall(
        `http://localhost:5000/api/subjects?branch=${Branch}`
      );
      if (data) setSubjects(data);
      setLoading(false);
    };

    if (Branch) fetchSubjects();
    else setLoading(false);
  }, []);

  const handleFileChange = (e) => setFiles([...e.target.files]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowToast(false); // Hide any previous toast
    setLoading(true);

    let response;
    let data = {};

    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();
      formData.append("DoubtID", uuidv4());
      formData.append("StudentID", student.StudentID);
      formData.append("Subject", subject);
      formData.append("Title", title);
      formData.append("Description", description);
      files.forEach((file) => formData.append("files", file));

      response = await fetch("http://localhost:5000/api/doubts", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      // 🎯 FIX: Attempt to safely parse the JSON data here.
      // This ensures we catch parsing failures without triggering the outer Network Error.
      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        }
      } catch (parseError) {
        // If JSON parsing fails (e.g., empty body), 'data' remains empty, but the error 
        // doesn't stop execution if response.ok is true.
        console.warn("Could not parse JSON response body.", parseError);
      }

      // --- FINAL SUCCESS/FAILURE CHECK ---
      if (response.ok) {
        // SUCCESS LOGIC
        const message = data.message || "🎉 Doubt submitted successfully! Redirecting...";
        setToastData({ title: 'Success', message: message, type: 'success' });
        setShowToast(true);

        // Clear form fields after successful submission
        setSubject("");
        setTitle("");
        setDescription("");
        setFiles([]);
        const fileInput = document.getElementById("file-input");
        if (fileInput) {
          fileInput.value = ""; // Clear file input only if element is found
        }
        // Navigate after a short delay
        setTimeout(() => {
         
        }, 1500);

      } else {
        // SERVER REPORTED ERROR (4xx or 5xx status)
        // 'data.message' will come from the safe parsing block above.
        const errorMessage = data.message || "Submission failed due to server error.";
        setToastData({ title: 'Error', message: errorMessage, type: 'danger' });
        setShowToast(true);
      }

    } catch (err) {
      // CATCH BLOCK: This should now only handle true connection failures (pre-response).
      console.error("Critical Submission Failure:", err);
      setToastData({
        title: 'Network Error',
        message: "❌ Connection issue or server unavailable. Please try again.",
        type: 'danger'
      });
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !showToast)
    return (
      <div className="d-flex justify-content-center align-items-center prof-aid-bg" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="light" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );


  return (
    <div className="prof-aid-bg">
      <style>{customStyles}</style>
      <StudentNavbar />

      {/* 🎯 TOAST COMPONENT */}
      <FeedbackToast
        show={showToast}
        onClose={() => setShowToast(false)}
        title={toastData.title}
        message={toastData.message}
        type={toastData.type}
      />

      <Container className="ask-page-wrapper d-flex justify-content-center">

        <Card className="prof-aid-form-card" style={{ maxWidth: '800px', width: '100%' }}>
          <Card.Title className="text-center mb-4">
            <h2 className="prof-aid-text-accent">💭 Ask a Doubt</h2>
          </Card.Title>

          {/* Note: The old Alert component is removed as the Toast handles feedback */}

          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              {/* Subject Select */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">📘 Subject</Form.Label>
                  <Form.Select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    size="lg"
                  >
                    <option value="">-- Select Subject --</option>
                    {subjects.map((subj, idx) => (
                      <option key={idx} value={subj}>
                        {subj}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Doubt Title */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">📝 Doubt Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Enter your doubt title (max 100 characters)"
                    size="lg"
                  />
                </Form.Group>
              </Col>

              {/* Description */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">🧠 Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={5}
                    placeholder="Describe your doubt clearly..."
                    size="lg"
                  />
                </Form.Group>
              </Col>

              {/* File Attachments */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">📎 Attach Files (Images/PDFs)</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    id="file-input"
                  />
                  {files.length > 0 && (
                    <div className="file-list small text-muted">
                      Files to upload: {files.map(f => f.name).join(', ')}
                    </div>
                  )}
                </Form.Group>
              </Col>

              {/* Submit Button */}
              <Col md={12} className="mt-4">
                <Button
                  type="submit"
                  className="w-100 btn-lg btn-prof-aid shadow"
                  disabled={loading}
                >
                  <FaPaperPlane className="me-2" />
                  {loading ? 'Submitting...' : 'Submit Doubt'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </Container>
      <footer className="w-100 py-3 text-center text-white small mb-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', marginTop: 'auto' }}>
              <Container>
                <p className="mb-0" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
                  &copy; {new Date().getFullYear()} Profaid EdTech Platform. All rights reserved.
                </p>
              </Container>
            </footer>
    </div>
  );
};

export default AskDoubt;