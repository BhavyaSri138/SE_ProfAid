import { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaGraduationCap } from 'react-icons/fa';

// Import Bootstrap components
import { Dropdown, Button, Navbar, Container } from "react-bootstrap";

// --- Custom Styles (ProfAid Theme) ---
const NAVBAR_BG_STYLE = 'rgba(255, 255, 255, 0.1)'; // Semi-transparent white
const LOGOUT_BUTTON_COLOR = "#D84315"; // Deep Burnt-Orange for the logout CTA
const TEXT_COLOR = "white"; // White text for contrast on the orange background

const ProfessorNavbar = () => {
  const navigate = useNavigate();
  const [professor, setProfessor] = useState({
    ID: "",
    Name: "",
    Email: "",
    Department: "",
  });

  const dropdownRef = useRef(null);

  useEffect(() => {
    // Fetch data from localStorage
    const ID = localStorage.getItem("ID") || "";
    const Name = localStorage.getItem("Name") || "";
    const Email = localStorage.getItem("Email") || "";
    const Department = localStorage.getItem("Department") || "";

    setProfessor({ ID, Name, Email, Department });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const navigateToChangePassword = () => {
    navigate("/change-password");
  };

  return (
    <Navbar
      // Applying the AdminNavbar's classes and styles
      className="navbar navbar-expand-lg navbar-dark shadow-sm"
      style={{
        backgroundColor: NAVBAR_BG_STYLE,
        // Setting position to fixed-top ensures proper alignment with the background
        
        top: 0,
        width: '100%',
        zIndex: 1020
      }}
    >
      <Container className="container-xl">

        {/* Brand Logo and Text matching AdminNavbar (using placeholder image) */}
        <a className="navbar-brand fw-bolder text-white fs-3 d-flex align-items-center" href="/student-dashboard">
          <FaGraduationCap
            className="me-2 fs-3"
            style={{ color: TEXT_COLOR }}
          />
          <span style={{ color: TEXT_COLOR, textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>ProfAid</span>
        </a>

        {/* User Profile Dropdown */}
        <div className="d-flex align-items-center">
          <Dropdown align="end" ref={dropdownRef}>
            <Dropdown.Toggle as="div" id="profile-dropdown-toggle">
              <FaUserCircle
                size={28}
                color={TEXT_COLOR} // White user icon
                style={{ cursor: "pointer" }}
              />
            </Dropdown.Toggle>

            {/* Dropdown Menu Content */}
            <Dropdown.Menu className="shadow-lg rounded-3 p-2">
              <div className="p-2">
                <p className="mb-1 small text-dark">
                  <strong>ID:</strong> {professor.ID}
                </p>
                <p className="mb-1 small text-dark">
                  <strong>Name:</strong> {professor.Name}
                </p>
                <p className="mb-1 small text-dark">
                  <strong>Email:</strong> {professor.Email}
                </p>
                {/* Professor-specific detail */}
                <p className="mb-2 small text-dark">
                  <strong>Dept:</strong> {professor.Department}
                </p>
              </div>
              <Dropdown.Divider />

              <Dropdown.Item as="button" onClick={navigateToChangePassword}>
                Change Password
              </Dropdown.Item>

              <Dropdown.Item as="div" className="mt-2">
                <Button
                  onClick={handleLogout}
                  className="w-100"
                  // Style the button to match the vibrant coral CTA
                  style={{ backgroundColor: LOGOUT_BUTTON_COLOR, borderColor: LOGOUT_BUTTON_COLOR }}
                >
                  Logout
                </Button>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

      </Container>
    </Navbar>
  );
};

export default ProfessorNavbar;