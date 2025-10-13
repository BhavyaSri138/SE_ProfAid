import { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaGraduationCap } from 'react-icons/fa'; // Import Graduation Cap icon for the logo

// Import Bootstrap components
import { Dropdown, Button, Navbar, Container } from "react-bootstrap"; 

// --- Custom Styles (ProfAid Theme) ---
const NAVBAR_BG_STYLE = 'rgba(255, 255, 255, 0.1)'; // Semi-transparent white
const LOGOUT_BUTTON_COLOR = "#D84315"; // Deep Burnt-Orange for the logout CTA
const TEXT_COLOR = "white"; // White text for contrast on the orange background

const StudentNavbar = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    ID: "",
    Name: "",
    Email: "",
    Branch: "",
  });
  
  // Use useRef for the Dropdown component (handles click outside automatically)
  const dropdownRef = useRef(null); 

  useEffect(() => {
    // Fetch data from localStorage
    const ID = localStorage.getItem("ID") || "";
    const Name = localStorage.getItem("Name") || "";
    const Email = localStorage.getItem("Email") || "";
    const Branch = localStorage.getItem("Branch") || "";

    setStudent({ ID, Name, Email, Branch });
  }, []);

  // Removed the manual setShowProfileDropdown state and useEffect, as Dropdown handles it

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <Navbar 
        // Applying the ProfAid theme styles
        className="navbar navbar-expand-lg navbar-dark shadow-sm" 
        style={{ 
            backgroundColor: NAVBAR_BG_STYLE, 
            
            top: 0,
            zIndex: 1020 // High z-index to stay above other content
        }}
    >
        <Container className="container-xl">
          
          {/* Brand Logo and Text using FaGraduationCap and ProfAid colors */}
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
              {/* Dropdown Toggle Button (the user circle icon) */}
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
                    <strong>ID:</strong> {student.ID}
                  </p>
                  <p className="mb-1 small text-dark">
                    <strong>Name:</strong> {student.Name}
                  </p>
                  <p className="mb-1 small text-dark">
                    <strong>Email:</strong> {student.Email}
                  </p>
                  {/* Student-specific detail */}
                  <p className="mb-2 small text-dark">
                    <strong>Branch:</strong> {student.Branch}
                  </p>
                </div>
                <Dropdown.Divider />
                
                <Dropdown.Item as="button" onClick={() => navigate("/change-password")}>
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

export default StudentNavbar;