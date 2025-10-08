import React, { useState } from 'react';
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import axios from "axios"; 
import { FaGraduationCap } from 'react-icons/fa'; // Used for the brand logo

// Import Bootstrap components
import {
    Container,
    Button,
} from "react-bootstrap";


// --- Define Custom Styles (ProfAid Theme) ---
const customStyles = `
  /* 1. Full-Screen Gradient Background */
  .prof-aid-bg-full {
    background: linear-gradient(135deg, #FF7B54 0%, #FFB547 50%, #FFD28A 100%);
    min-height: 100vh;
    color: #333333; /* Dark text for cards */
  }

  /* 2. Primary Button/Accent Color (Coral) */
  .btn-prof-aid, .btn-prof-aid:hover, .btn-prof-aid:focus {
    background-color: #FF7B54 !important; 
    border-color: #FF7B54 !important;
    color: white !important;
  }
  
  /* 3. Deep Accent Color (Burnt Orange) - For form input borders/outlines */
  .prof-aid-deep-accent-text {
      color: #D84315 !important; 
  }
  
  /* 4. Navbar Styling (Semi-transparent white over gradient) */
  .prof-aid-navbar-transparent {
    background-color: rgba(255, 255, 255, 0.1) !important; 
  }

  /* 5. Role Card Styling */
  .prof-aid-role-card {
    background-color: rgba(255, 255, 255, 0.95); /* Opaque white */
    border: 3px solid #FF7B54 !important; /* Coral border */
    border-radius: 12px !important; 
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); 
    transition: all 0.3s ease;
  }
  
  .prof-aid-role-card:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  /* 6. Form Input Focus */
  .form-control:focus, .form-control:focus:active {
    border-color: #FF7B54 !important;
    box-shadow: 0 0 0 0.25rem rgba(255, 123, 84, 0.25) !important; /* Soft coral shadow */
  }
`;

// --- Inline SVG Icons (For password toggle) ---
const EyeIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
  </svg>
);
const EyeSlashIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457L13.359 11.238zm0 0L8.715 6.64l-.784-.784 1.5-1.5z"/>
    <path d="M11.297 9.878a3.5 3.5 0 0 0-4.885-4.885zm-4.72-3.872.771.771L.72 12.56.242 12A8.026 8.026 0 0 1 8 4.5c.783 0 1.55.148 2.274.42l-.774.774zm1.94 4.5a2.5 2.5 0 1 0-3.376-3.376l-.746-.746a3.5 3.5 0 0 1 4.796 4.796l.746.746z"/>
    <path d="M.242 12.022 12.559.705 13.265 0 14.331 1.066l-2.071 2.072L8 7.917V8A8.026 8.026 0 0 1 .242 12.022z"/>
  </svg>
);

// --- Role Data (Using Bootstrap Icons for simplicity) ---
const roleIcons = {
    Student: 'bi bi-person-badge',
    Professor: 'bi bi-award',
    Admin: 'bi bi-shield-check',
};
const roleHeadings = {
    Student: 'Student Login',
    Professor: 'Professor Access',
    Admin: 'Admin Panel',
};
const roleDescriptions = {
    Student: 'Access your courses and materials.',
    Professor: 'Manage classes and grade assignments.',
    Admin: 'System configuration and user management.',
};

// Router Wrapper for standalone preview (Retained for preview stability)
const AppWrapper = ({ children }) => (
    <Router>{children}</Router>
);

const Login = () => {
  const [role, setRole] = useState(""); // Student / Professor / Admin
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!role) {
      setError("Please select a role");
      return;
    }

    try {
      // NOTE: Original code used lowercase role name for endpoint, adjusting to match:
      const endpoint = role === 'Admin' ? 'admins' : `${role.toLowerCase()}s`;
      
      const { data } = await axios.post(
        `http://localhost:5000/api/${endpoint}/login`,
        { Email: email, Password: password }
      );

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("role", role);
      localStorage.setItem("ID", data.StudentID || data.ProfessorID || data.AdminID);
      localStorage.setItem("Name", data.Name || data.AdminName);
      localStorage.setItem("Email", data.Email);
      localStorage.setItem("Password", password); // ⚠️ Storing password retained from original code for functional fidelity.

      if (data.Branch) localStorage.setItem("Branch", data.Branch);
      if (data.Department) localStorage.setItem("Department", data.Department);

      if (role === "Student") navigate("/student-dashboard");
      else if (role === "Professor") navigate("/professor-dashboard");
      else if (role === "Admin") navigate("/admin-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="prof-aid-bg-full d-flex flex-column">
      <style>{customStyles}</style>
      
      {/* --- 1. NAVBAR (Transparent over Gradient, using FaGraduationCap) --- */}
      <nav className="navbar navbar-expand-lg navbar-dark shadow-sm prof-aid-navbar-transparent">
        <Container className="container-xl">
          <a className="navbar-brand fw-bolder text-white fs-3 d-flex align-items-center" href="#">
            <FaGraduationCap className="me-2 fs-2" />
            Profaid
          </a>
        </Container>
      </nav>

      {/* --- 2. MAIN CONTENT & ROLE SELECTION --- */}
      <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center p-3 p-md-5">
        <div className="text-center mb-5 text-white">
            {/* Title matching the screenshot style */}
            <h1 className="fw-bolder display-4" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.4)'}}>
                Welcome to the Profaid Platform
            </h1>
            <p className="fs-6 mt-3" style={{textShadow: '0 1px 2px rgba(0,0,0,0.4)'}}>
                Select your role to securely access your dedicated learning or management portal.
            </p>
        </div>

        {/* Role Cards / Selection */}
        {!role ? (
            <div className="row g-4 justify-content-center" style={{ maxWidth: '1200px', width: '100%' }}>
                {["Student", "Professor", "Admin"].map((r) => (
                    <div key={r} className="col-lg-4 col-md-6 col-sm-12">
                        <div 
                            className="card text-center p-4 h-100 prof-aid-role-card" 
                            onClick={() => {setRole(r); setError("");}}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className={`fs-3 mb-3 mx-auto`} style={{ color: '#FF7B54' }}>
                                <i className={`${roleIcons[r]} p-3 rounded-circle border border-3`} style={{ borderColor: '#FF7B54' }}></i>
                            </div>
                            <h3 className="fw-bold fs-4" style={{ color: '#D84315' }}>{roleHeadings[r]}</h3>
                            <p className="text-muted">{roleDescriptions[r]}</p>
                            
                            {/* The Login Button itself */}
                            <Button className="btn btn-sm text-white fw-bold mt-auto btn-prof-aid">
                                Log In
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
             <div 
                // Login Form Card
                className="card shadow-lg p-4 p-md-5 bg-white bg-opacity-95" 
                style={{ maxWidth: "480px", width: "95%", borderRadius: "1.5rem" }}
             >
                <div className="text-center mb-4">
                    <h3 className="fw-bolder prof-aid-deep-accent-text">
                        {roleHeadings[role]}
                    </h3>
                    <p className="text-muted">Enter credentials for secure access.</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    
                    {/* Email Input */}
                    <div className="mb-3">
                      <label htmlFor="emailInput" className="form-label text-secondary fw-semibold visually-hidden">
                        Email Address
                      </label>
                      <div className="input-group">
                          <span className="input-group-text bg-light text-secondary">
                              <i className="bi bi-envelope"></i>
                          </span>
                          <input
                            id="emailInput"
                            type="email"
                            placeholder="Enter registered email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="form-control form-control-lg"
                          />
                      </div>
                    </div>

                    {/* Password Input with Toggle */}
                    <div className="input-group mb-4">
                       <span className="input-group-text bg-light text-secondary">
                          <i className="bi bi-lock"></i>
                       </span>
                      <input
                        id="passwordInput"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-control form-control-lg"
                      />
                      <span
                        className="input-group-text bg-white"
                        onClick={() => setShowPassword((prev) => !prev)}
                        style={{ cursor: "pointer" }}
                      >
                        {/* Using inline SVG components */}
                        {showPassword ? <EyeSlashIcon className="text-secondary" /> : <EyeIcon className="text-secondary" />}
                      </span>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="alert alert-danger text-center py-2" role="alert">
                        {error}
                      </div>
                    )}
                    
                    <button 
                      type="button" 
                      onClick={() => {setRole(""); setError("")}} // Go back to role selection
                      className="btn btn-outline-secondary btn-sm w-100 mb-2"
                    >
                        <i className="bi bi-arrow-left me-2"></i>Change Role
                    </button>

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      className="btn btn-lg w-100 fw-bolder shadow-lg btn-prof-aid"
                      style={{ padding: '15px', borderRadius: '10px' }}
                    >
                      <i className="bi bi-box-arrow-in-right me-2"></i>Login as {role}
                    </Button>
                  </form>
             </div>
        )}
        
      </div>

      {/* --- 3. FOOTER --- */}
      <footer className="w-100 py-3 text-center text-white small" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', marginTop: 'auto' }}>
        <Container>
          <p className="mb-0" style={{textShadow: '0 1px 2px rgba(0,0,0,0.4)'}}>
             &copy; {new Date().getFullYear()} Profaid EdTech Platform. All rights reserved.
          </p>
        </Container>
      </footer>
    </div>
  );
};


export default Login;