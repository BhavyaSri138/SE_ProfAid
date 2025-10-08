import { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// Import Bootstrap components
import { Dropdown, Button } from "react-bootstrap"; 

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({
    ID: "",
    Name: "",
    Email: "",
  });
  const dropdownRef = useRef(null);

  // Define the colors
  const NAVBAR_BG_STYLE = 'rgba(255, 255, 255, 0.1)'; // Semi-transparent white
  const LOGOUT_BUTTON_COLOR = "#D84315"; // Deep Red-Orange for the logout CTA
  const TEXT_COLOR = "white"; // White text for contrast on the orange background

  useEffect(() => {
    const ID = localStorage.getItem("ID") || "";
    const Name = localStorage.getItem("Name") || "";
    const Email = localStorage.getItem("Email") || "";
    setAdmin({ ID, Name, Email });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };
  
  return (
    <nav 
        // Applying the requested classes: navbar-dark, shadow-sm, and semi-transparent background
        className="navbar navbar-expand-lg navbar-dark shadow-sm" 
        style={{ 
            backgroundColor: NAVBAR_BG_STYLE, 
           
            top: 0,
            zIndex: 1020 // High z-index to stay above other content
        }}
    >
        <div className="container-fluid container-xl">
          
          {/* Brand Logo and Text with image placeholder */}
          <a className="navbar-brand fw-bolder text-white fs-3" href="/admin-dashboard">
            {/* ⚠️ NOTE: Replace the src with your actual image path in production! */}
            <img 
                src="https://placehold.co/30x30/FFFFFF/FF7B54?text=P" 
                alt="Profaid Logo" 
                className="me-2 rounded"
                style={{ height: '30px', width: '30px' }} 
            />
            <span style={{ color: TEXT_COLOR }}>Profaid</span> 
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

              {/* Dropdown menu content remains white for readability */}
              <Dropdown.Menu className="shadow-lg rounded-3 p-2">
                <div className="p-2">
                  <p className="mb-1 small text-dark">
                    <strong>ID:</strong> {admin.ID}
                  </p>
                  <p className="mb-1 small text-dark">
                    <strong>Name:</strong> {admin.Name}
                  </p>
                  <p className="mb-2 small text-dark">
                    <strong>Email:</strong> {admin.Email}
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
          
        </div>
      </nav>
  );
};

export default AdminNavbar;