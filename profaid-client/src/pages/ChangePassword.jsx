import { useState } from "react";
import { FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa";
import AdminNavbar from "../components/AdminNavbar";

// Import Bootstrap components
import {
  Container,
  Card,
  Form,
  Button,
  InputGroup,
  Alert,
} from "react-bootstrap";

// Define the custom styles using the Prof-Aid palette
const customStyles = `
  /* 1. Gradient Background (Warm Sunset) - Covers the entire view */
  .prof-aid-bg-full {
    background: linear-gradient(135deg, #FF7B54 0%, #FFB547 50%, #FFD28A 100%);
    min-height: 100vh;
    padding-bottom: 40px;
    color: #333333; /* Default dark text */
  }
  
  /* 2. Primary Accent Color (Coral/Button color) */
  .btn-prof-aid, .btn-prof-aid:hover, .btn-prof-aid:focus {
    background-color: #FF7B54 !important; 
    border-color: #FF7B54 !important;
    color: white !important;
  }
  
  /* 3. Text and Accent Color */
  .prof-aid-text-accent {
      color: #D84315 !important; /* Rich burnt-orange for titles/emphasis */
  }

  /* 4. Card Styling (Clean White, Rounded, Shadow) */
  .prof-aid-card {
    border: none;
    border-radius: 12px; 
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15); 
  }

  /* 5. Custom Header Styling (Ensures transparent background and matching shadow) */
  .prof-aid-header {
    padding: 10px 0; /* Bootstrap padding */
    color: white;
    font-weight: 700;
    /* Explicitly setting the background style from your request */
    background-color: rgba(255, 255, 255, 0.1); 
  }

  /* Styling for the eye icon in the input group */
  .eye-icon-button {
    background-color: #fffaf0 !important; 
    border-color: #FFB547 !important;
  }
`;

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null); // { type: 'success'|'danger', text: '...' }

  // For toggling password visibility
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const userID = localStorage.getItem("ID") || "User"; // ID (StudentID or ProfessorID)
  const role = localStorage.getItem("role") || ""; // "Student" or "Professor"

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "danger", text: "New passwords do not match!" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: "danger", text: "New password must be at least 6 characters long." });
      return;
    }
    
    // Determine the correct API endpoint
    let endpoint = "";
    if (role === "Professor") {
      endpoint = "http://localhost:5000/api/professors/change-password";
    } else if (role === "Student") {
      endpoint = "http://localhost:5000/api/students/change-password";
    } else if (role === "Admin") {
      endpoint = "http://localhost:5000/api/admins/change-password";
    } else {
      setMessage({ type: "danger", text: "Invalid user role. Please log in." });
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: "Password changed successfully. Logging you out...",
        });
        
        // Clear auth and redirect after success
        localStorage.clear();
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        setMessage({
          type: "danger",
          text: data.message || "Error changing password. Check your old password.",
        });
      }
    } catch (err) {
      setMessage({ type: "danger", text: "Network Error: Could not connect to the server." });
    }
  };

  return (
    <div className="prof-aid-bg-full">
      {/* Inject custom styles for the theme */}
      <style>{customStyles}</style>

      <AdminNavbar />

      {/* Main Content Title */}
      <h1 className="text-center text-white my-5" style={{ fontSize: '3rem', fontWeight: 700, textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}>
        Account Security
      </h1>

      {/* Change Password Form Container */}
      <Container className="d-flex justify-content-center">
        <Card className="prof-aid-card" style={{ width: "100%", maxWidth: "450px" }}>
          <Card.Body>
            <Card.Title className="text-center prof-aid-text-accent mb-4">
              <h2>Change Password</h2>
            </Card.Title>
            
            {/* Message Alert */}
            {message && (
              <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
                {message.text}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              {/* Old Password */}
              <Form.Group className="mb-3">
                <Form.Label>Old Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showOld ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowOld(!showOld)}
                    className="eye-icon-button"
                  >
                    {showOld ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputGroup>
              </Form.Group>

              {/* New Password */}
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowNew(!showNew)}
                    className="eye-icon-button"
                  >
                    {showNew ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputGroup>
                <Form.Text className="text-muted">
                    Must be at least 6 characters.
                </Form.Text>
              </Form.Group>

              {/* Confirm Password */}
              <Form.Group className="mb-4">
                <Form.Label>Confirm New Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="eye-icon-button"
                  >
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputGroup>
              </Form.Group>

              <Button type="submit" className="btn-prof-aid w-100">
                Change Password
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ChangePassword;