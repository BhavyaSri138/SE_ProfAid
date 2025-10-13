import { useEffect, useState } from "react";
import { FaFileAlt, FaUserCircle, FaCheckCircle, FaExclamationCircle, FaPaperPlane } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import ProfessorNavbar from "../components/ProfessorNavbar";
import StudentNavbar from "../components/StudentNavbar";

// Import Bootstrap components
import { Container, Card, Button, Form, Spinner, Alert, Row, Toast, ToastContainer } from "react-bootstrap"; 
import { v4 as uuidv4 } from "uuid";

// --- Custom Styles (ProfAid Theme) ---
const customStyles = `
  /* 1. Full-Screen Gradient Background (Warm Sunset) */
  .prof-aid-bg {
    background: linear-gradient(135deg, #FF7B54 0%, #FFB547 50%, #FFD28A 100%);
    min-height: 100vh;
    color: #333333; 
    padding-bottom: 40px;
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
  
  /* 4. Form/Main Content Card (Clean White) */
  .prof-aid-content-card {
    background: rgba(255, 255, 255, 0.95);
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }

  /* 5. Input Styling Focus */
  .form-control:focus, .form-select:focus {
    border-color: #FF7B54 !important;
    box-shadow: 0 0 0 0.25rem rgba(255, 123, 84, 0.25) !important; /* Soft coral shadow */
  }

  /* 6. Page Layout */
  .view-doubt-wrapper {
      padding-top: 80px; /* Clear the fixed Navbar */
      max-width: 900px;
      margin: 0 auto;
  }

  /* 7. Reply Card Styles */
  .reply-card-professor {
      background: #fff3e0; /* Lightest tone for Prof reply */
      border: 1px solid #FFB547;
  }

  .reply-card-student {
      background: #fdfdfd; /* Pure white/very light for Student extension */
      border: 1px solid #FFD28A;
  }
  
  .prof-aid-green-btn {
      background-color: #4CAF50 !important;
      border-color: #4CAF50 !important;
      color: white !important;
      font-weight: bold;
  }
`;

// --- FIX: Inline FeedbackToast Component (Globally defined) ---
const FeedbackToast = ({ show, onClose, title, message, type }) => {
    const HEADER_COLOR = type === 'success' ? '#4CAF50' : '#D84315';
    const ICON = type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />;
    
    return (
        <ToastContainer 
            // 🎯 FIX: Adjust top position to sit below the fixed Navbar
            position="top-center" 
            style={{ 
                zIndex: 1080, 
                marginTop: '65px', // Pushes the toast down, clearing the fixed navbar (~60px tall)
                position: 'fixed' // Ensures it stays visible on scroll
            }}
        >
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


const ViewDoubt = () => {
  const { doubtID } = useParams();
  const [doubt, setDoubt] = useState(null);
  const [user, setUser] = useState({ ID: "", role: "" });
  const [loading, setLoading] = useState(true);
  const [extensionDescription, setExtensionDescription] = useState("");
  const [extensionFiles, setExtensionFiles] = useState([]);
  const [extendMode, setExtendMode] = useState(false);
  
  // 🎯 State for Toast Notifications (replaces showModal/modalType)
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', message: '', type: 'success' });
  
  const navigate = useNavigate();

  const handleFetch = async (url, options = {}) => {
    try {
        const token = localStorage.getItem("authToken");
        const headers = options.headers || {};
        
        const res = await fetch(url, {
            ...options,
            headers: {
                ...headers,
                'Authorization': `Bearer ${token}`,
            },
        });
        
        const data = await res.json();
        
        if (!res.ok) {
            throw new Error(data.message || 'Operation failed');
        }
        return data;
    } catch (err) {
        console.error("API Error:", err);
        setToastMessage({ title: 'Error', message: err.message || 'An unexpected error occurred.', type: 'error' });
        setShowToast(true);
        return null;
    }
  };


  useEffect(() => {
    const ID = localStorage.getItem("ID") || "";
    const role = localStorage.getItem("role") || "";
    setUser({ ID, role });

    const fetchDoubt = async () => {
      const data = await handleFetch(`http://localhost:5000/api/doubts/${doubtID}`);
      if (data) setDoubt(data);
      setLoading(false);
    };

    fetchDoubt();
  }, [doubtID]);

  const handleClarified = async () => {
    const data = await handleFetch(`http://localhost:5000/api/doubts/clarify/${doubtID}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Status: "Clarified" }),
    });

    if (data) {
        setDoubt(data);
        setToastMessage({ title: 'Success', message: "Doubt marked as Clarified! Redirecting...", type: 'success' });
        setShowToast(true);
    }
  };

  const handleExtendOrReply = async () => {
    if (!extensionDescription.trim()) {
      setToastMessage({ title: 'Input Error', message: "Description cannot be empty.", type: 'error' });
      setShowToast(true);
      return;
    }
    
    const token = localStorage.getItem("authToken");
    const formData = new FormData();
    // Assuming uuidv4 is imported correctly at the top
    formData.append("Message", extensionDescription);
    formData.append("SenderID", user.ID);

    for (let i = 0; i < extensionFiles.length; i++) {
      formData.append("Files", extensionFiles[i]);
    }

    const apiUrl =
      user.role === "Professor"
        ? `http://localhost:5000/api/doubts/reply/${doubtID}`
        : `http://localhost:5000/api/doubts/extend/${doubtID}`;

    const data = await handleFetch(apiUrl, { method: "PATCH", body: formData });

    if (data) {
        setDoubt(data);
        const successMsg = user.role === "Professor" ? "Reply sent successfully." : "Extension submitted successfully.";
        setToastMessage({ title: 'Success', message: successMsg, type: 'success' });
        setShowToast(true);

        // Reset form fields
        setExtensionDescription("");
        setExtensionFiles([]);
        setExtendMode(false);
        if (document.getElementById("extension-file-input")) {
            document.getElementById("extension-file-input").value = "";
        }
    }
  };
  
  const handleToastClose = () => {
      setShowToast(false);
      // Navigate only after marking clarified, once the user acknowledges the toast
      if (toastMessage.message.includes('Clarified')) {
          navigate(user.role === "Student" ? "/my-doubts" : "/professor-dashboard");
      }
  };


  if (loading) return (
    <div className="d-flex justify-content-center align-items-center prof-aid-bg" style={{height: "100vh"}}>
        <Spinner animation="border" variant="light" role="status" />
    </div>
  );
  
  if (!doubt) return (
    <div className="prof-aid-bg" style={{ minHeight: "100vh", paddingTop: "80px" }}>
        <h2 className="text-white text-center">Doubt not found.</h2>
    </div>
  );

  const isStudent = user.role === "Student";
  const isProfessor = user.role === "Professor";
  const isDoubtClarified = doubt.Status === "Clarified";

  // Determine Navbar type
  const NavbarComponent = isStudent ? StudentNavbar : (isProfessor ? ProfessorNavbar : () => null);

  return (
    <div className="prof-aid-bg">
      <style>{customStyles}</style>
      
      <NavbarComponent />

      <Container className="view-doubt-wrapper">
        <Card className="prof-aid-content-card">
            <Card.Body>
                <h2 className="prof-aid-text-accent mb-3">{doubt.Title}</h2>
                <small className="text-muted">
                    **Subject:** {doubt.Subject} | **Status:** <span className={`fw-bold ms-1`} style={{ color: isDoubtClarified ? '#4CAF50' : '#FF7B54' }}>
                        {doubt.Status}
                    </span>
                </small>
                <hr />

                <h5 className="fw-bold">Description:</h5>
                <p className="mb-2">{doubt.Description}</p>
                <p className="fst-italic text-muted small">
                    Posted by: {user.ID === doubt.StudentID ? "You" : doubt.StudentID} on {new Date(doubt.CreatedAt).toLocaleString()}
                </p>

                {/* Attached Files */}
                {doubt.FilesAttached?.length > 0 && (
                <div className="mt-3 p-3 bg-light rounded">
                    <h5 className="prof-aid-primary-color fw-bold small">Attached Files:</h5>
                    {doubt.FilesAttached.map((file, idx) => (
                    <div key={idx} className="small">
                        <a
                        href={`http://localhost:5000/uploads/${file}`}
                        target="_blank"
                        rel="noreferrer"
                        className="prof-aid-text-accent text-decoration-underline"
                        >
                        <FaFileAlt className="me-1" /> {file}
                        </a>
                    </div>
                    ))}
                </div>
                )}
                
                <h3 className="prof-aid-text-accent mt-4">Replies & Extensions</h3>
                
                {/* Replies Section */}
                {doubt.Replies?.length === 0 ? (
                    <p className="text-muted">No replies or extensions yet.</p>
                ) : (
                    doubt.Replies.map((reply, idx) => {
                        const isReplyStudent = reply.SenderID === doubt.StudentID;
                        const cardClass = isReplyStudent ? 'reply-card-student' : 'reply-card-professor';
                        const textColor = isReplyStudent ? '#333' : '#D84315';
                        const iconColor = isReplyStudent ? '#FFB547' : '#D84315';
                        const senderLabel = reply.SenderID === user.ID
                            ? "You"
                            : isReplyStudent
                            ? "Student"
                            : "Professor";

                        return (
                            <Card key={idx} className={`mb-3 ${cardClass}`} style={{ borderLeft: `5px solid ${isReplyStudent ? '#FFB547' : '#D84315'}` }}>
                                <Card.Body className="p-3">
                                    <div className="d-flex align-items-center mb-2">
                                        <FaUserCircle size={24} style={{ color: iconColor }} />
                                        <span className="ms-2 fw-bold small" style={{ color: textColor }}>
                                            {senderLabel}
                                        </span>
                                        <small className="ms-auto text-muted">{new Date(reply.RepliedAt).toLocaleString()}</small>
                                    </div>
                                    <p className="mb-2 small">{reply.Message}</p>

                                    {reply.FilesAttached?.length > 0 && (
                                        <div className="mt-2 small">
                                            <small className="fw-semibold me-2">Attachments:</small>
                                            {reply.FilesAttached.map((file, idx2) => (
                                                <div key={idx2}>
                                                    <a
                                                        href={`http://localhost:5000/uploads/${file}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-primary text-decoration-underline"
                                                    >
                                                        <FaFileAlt /> {file}
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        );
                    })
                )}

                {/* --- Action Buttons / Clarification Status --- */}
                {!isDoubtClarified && (
                    <div className="mt-4 pt-3 border-top">
                        {(isStudent && user.ID === doubt.StudentID) && (
                            // Student Actions: Clarified or Extend
                            <div className="d-flex align-items-center mb-3">
                                <h5 className="prof-aid-text-accent mb-0 me-3">Is Your Doubt Clarified?</h5>
                                <Button onClick={handleClarified} className="btn-success me-2 prof-aid-green-btn">
                                    Yes
                                </Button>
                                <Button onClick={() => setExtendMode(true)} className="btn-prof-aid">
                                    No (Extend)
                                </Button>
                            </div>
                        )}
                        
                        {/* Extension / Reply Form */}
                        {((isStudent && extendMode) || isProfessor) && (
                            <div className="mt-3">
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">
                                        {isStudent ? "Add Extension Details" : "Write Your Reply"}
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        value={extensionDescription}
                                        onChange={(e) => setExtensionDescription(e.target.value)}
                                        placeholder={isStudent ? "Add more details for the professor..." : "Write your comprehensive reply here..."}
                                        rows={4}
                                    />
                                </Form.Group>
                                
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        type="file"
                                        multiple
                                        onChange={(e) => setExtensionFiles(e.target.files)}
                                        id="extension-file-input"
                                    />
                                </Form.Group>

                                <Button
                                    onClick={handleExtendOrReply}
                                    className="btn-prof-aid shadow"
                                >
                                    <FaPaperPlane className="me-2" /> 
                                    Submit {isStudent ? "Extension" : "Reply"}
                                </Button>

                                {(isStudent && extendMode) && (
                                    <Button variant="secondary" onClick={() => setExtendMode(false)} className="ms-2">
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                )}
                
                {isDoubtClarified && (
                    <Alert variant="success" className="mt-4">
                        <FaCheckCircle className="me-2" /> This doubt has been marked as **Clarified**.
                    </Alert>
                )}
                
            </Card.Body>
        </Card>
      </Container>
      
      {/* TOAST NOTIFICATION COMPONENT */}
      <FeedbackToast 
        show={showToast} 
        onClose={handleToastClose} 
        title={toastMessage.title} 
        message={toastMessage.message} 
        type={toastMessage.type} 
      />
    </div>
  );
};

export default ViewDoubt;