import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import 'animate.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FaBell, FaLock, FaBook, FaMobileAlt, FaUserAlt, FaPenFancy, FaComments, FaGraduationCap } from 'react-icons/fa'; // Added FaGraduationCap
import { Link } from "react-router-dom"; 

// --- ProfAid Custom Styles (Unified Warm Sunset Palette) ---
const customStyles = `
  /* Full-page gradient background (Used for Welcome and overall body background) */
  .prof-aid-full-gradient-bg {
    background: linear-gradient(135deg, #FF7B54 0%, #FFB547 50%, #FFD28A 100%);
    min-height: 100vh;
    color: #333333; 
    display: flex;
    flex-direction: column;
  }
  
  /* Primary Accent Color (Coral for Buttons, Links) */
  .prof-aid-primary-btn, .prof-aid-primary-btn:hover, .prof-aid-primary-btn:focus {
    background-color: #FF7B54 !important; /* The most vibrant coral */
    border-color: #FF7B54 !important;
    color: white !important;
    font-weight: 600;
  }
  
  /* Deep Accent Color (Burnt Orange for Titles, Navbar background) */
  .prof-aid-deep-accent {
    color: #D84315 !important; 
  }

  /* Navbar Styling (Semi-transparent white over the gradient) */
  .prof-aid-navbar-transparent {
    background-color: rgba(255, 255, 255, 0.1) !important; 
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    padding: 15px 0;
  }
  
  /* Card Styling (Clean White for contrast) */
  .prof-aid-card {
    background-color: white !important; 
    color: #333333; 
    border: none;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }
  
  .prof-aid-card:hover {
    transform: translateY(-5px);
  }

  /* Dark Feature Card (Using the deep accent color) */
  .prof-aid-dark-card {
    background-color: #D84315 !important; 
    color: white !important;
  }

  /* Text colors on gradient background */
  .text-on-gradient {
      color: white !important;
      text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  }
`;

export default function Home() {
  return (
    <div className="prof-aid-full-gradient-bg">
      <style>{customStyles}</style> 
      
      {/* --- Navbar (Semi-transparent over the gradient) --- */}
      <nav 
        className="navbar navbar-expand-lg navbar-dark prof-aid-navbar-transparent shadow-sm fixed-top" 
        style={{ zIndex: 1050 }}
      >
        <div className="container-fluid container-xl">
          <Link className="navbar-brand d-flex align-items-center text-white fw-bold fs-4" to="#home">
            <h4 className="m-0 text-on-gradient" style={{ fontWeight:'bolder' }}>
              <FaGraduationCap className="me-2 fs-1" /> ProfAid
            </h4>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            style={{ borderColor: 'white' }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link text-white text-on-gradient" href="#home">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white text-on-gradient" href="#about">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white text-on-gradient" href="#how">How It Works</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white text-on-gradient" href="#features">Features</a>
              </li>
              <li className="nav-item">
                {/* Login Button (White button for high contrast against the semi-transparent nav) */}
                <Link 
                    className="btn ms-3 btn-light fw-bold" 
                    to="/login"
                >
                    Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* --- Welcome Section (Part of the main full-screen gradient) --- */}
      <section 
        id="home" 
        className="text-center py-5" 
        style={{ paddingTop: '100px', minHeight: '500px', display: 'flex', alignItems: 'center' }}
      >
        <div className="container-fluid container-xl">
          <h1 
            className="display-3 fw-bold text-white animate__animated animate__fadeInDown" 
            style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}
          >
            Welcome to ProfAid Platform
          </h1>
          <p className="lead text-white mt-3 animate__animated animate__fadeIn">
            Ask doubts anytime. Get expert help from your faculty.
          </p>
          <div className="mt-5 animate__animated animate__fadeInUp">
            {/* Get Started Button (Primary Coral) */}
            <Link 
                to="/login"
                className="btn me-3 btn-lg prof-aid-primary-btn fw-bold shadow" 
            >
                Get Started
            </Link>
            {/* Learn More Button (White outline for high contrast) */}
            <a href="#about" className="btn btn-outline-light btn-lg fw-bold shadow-sm">
                Learn More
            </a>
          </div>
        </div>
      </section>

      {/* --- About Section (White background to clearly separate from Hero) --- */}
      <section id="about" className="py-5" style={{ backgroundColor: 'white' }}>
        <div className="container text-center">
          <h2 className="mb-3 prof-aid-deep-accent">About ProfAid</h2>
          <p className="mx-auto w-75 text-muted">
            ProfAid bridges the gap between students and professors, creating a seamless platform
            for academic support and doubt resolution. Our mission is to make **quality education**
            accessible and interactive for every student.
          </p>
          <blockquote className="fst-italic mt-4 text-dark">
            “Education is the most powerful weapon which you can use to change the world.” <br />
            <span className="fw-bold prof-aid-deep-accent">&mdash; Nelson Mandela</span>
          </blockquote>
        </div>
      </section>

      {/* --- How It Works Section (Mid-tone background, taken from gradient) --- */}
      <section id="how" className="py-5" style={{ backgroundColor: '#FFB547' }}>
        <div className="container-fluid container-xl">
          <h2 className="text-center mb-5 text-white">How It Works</h2>
          <div className="row text-center g-4">
            <div className="col-md-4">
              {/* Card (White) */}
              <div className="prof-aid-card h-100 p-4 animate__animated animate__fadeInLeft">
                <div className="fs-1 prof-aid-deep-accent"><FaUserAlt /></div>
                <h5 className="card-title mt-3 prof-aid-deep-accent">Post a Doubt</h5>
                <p className="card-text">
                  Students can easily post their academic doubts with detailed descriptions and relevant subject tags.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="prof-aid-card h-100 p-4 animate__animated animate__fadeInUp">
                <div className="fs-1 prof-aid-deep-accent"><FaPenFancy /></div>
                <h5 className="card-title mt-3 prof-aid-deep-accent">Faculty Responds</h5>
                <p className="card-text">
                  Qualified faculty members review and provide comprehensive answers to student queries promptly.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="prof-aid-card h-100 p-4 animate__animated animate__fadeInRight">
                <div className="fs-1 prof-aid-deep-accent"><FaComments /></div>
                <h5 className="card-title mt-3 prof-aid-deep-accent">Chat Follow-up</h5>
                <p className="card-text">
                  Continue the conversation with follow-up questions and real-time chat for better understanding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Features Section (Apricot Background - lightest shade) --- */}
      <section id="features" className="py-5" style={{ backgroundColor: '#FFD28A' }}>
        <div className="container-fluid container-xl">
          <h2 className="text-center mb-4 prof-aid-deep-accent">Core Features</h2>
          <p className="text-center text-muted mb-5">Everything you need for seamless academic support</p>
          <div className="row text-center g-4">
            {/* Cards (Deep Accent Color) */}
            <div className="col-md-3">
              <div className="prof-aid-card prof-aid-dark-card h-100 p-4 shadow animate__animated animate__zoomIn">
                <div className="fs-1"><FaBell /></div>
                <h5 className="mt-3">Real-time Notifications</h5>
                <p>Get **instant alerts** when your doubts are answered or when new discussions start.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="prof-aid-card prof-aid-dark-card h-100 p-4 shadow animate__animated animate__zoomIn animate__delay-1s">
                <div className="fs-1"><FaLock /></div>
                <h5 className="mt-3">Secure Login</h5>
                <p>Ensuring your data is safe and secure at all times with robust authentication.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="prof-aid-card prof-aid-dark-card h-100 p-4 shadow animate__animated animate__zoomIn animate__delay-2s">
                <div className="fs-1"><FaBook /></div>
                <h5 className="mt-3">Doubt History</h5>
                <p>Access your complete **doubt history** and track your learning progress over time.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="prof-aid-card prof-aid-dark-card h-100 p-4 shadow animate__animated animate__zoomIn animate__delay-3s">
                <div className="fs-1"><FaMobileAlt /></div>
                <h5 className="mt-3">Mobile Responsive</h5>
                <p>Access ProfAid seamlessly across **all devices** - desktop, tablet, and mobile.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer (Deep Accent Color) --- */}
      <footer
        className="prof-aid-deep-accent text-white"
        style={{ padding: '2rem 1rem' }}
      >
        <div className="container-fluid container-xl">
            <div
                className="footer-content"
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '2rem',
                    fontSize: '1rem',
                }}
            >
                {/* Brand Info */}
                <div className="footer-brand" style={{ flex: 1, minWidth: '200px' }}>
                    <h4 style={{ marginBottom: '0.75rem', fontWeight:'bolder' }}>
                      <i className="fas fa-graduation-cap"></i> ProfAid
                    </h4>
                    <p style={{ margin: 0 }}>© {new Date().getFullYear()} ProfAid. All rights reserved.</p>
                    <p style={{ margin: '0.5rem 0' }}>
                      Contact: <a href="mailto:support@profAid.com" className="text-white">support@profAid.com</a>
                    </p>
                </div>

                {/* Quick Links */}
                <div className="footer-links" style={{ flex: 1, minWidth: '200px' }}>
                    <h5 style={{ marginBottom: '0.75rem', fontWeight:'bold' }}>Quick Links</h5>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      <li style={{ marginBottom: '0.5rem' }}><a href="#about" className="text-white">About</a></li>
                      <li style={{ marginBottom: '0.5rem' }}><a href="#terms" className="text-white">Terms of Service</a></li>
                      <li><a href="#privacy" className="text-white">Privacy Policy</a></li>
                    </ul>
                </div>

                {/* Social */}
                <div className="footer-social" style={{ flex: 1, minWidth: '200px', textAlign: 'right' }}>
                    <h5 style={{ marginBottom: '0.75rem', fontWeight:'bold' }}>Follow Us</h5>
                    <div className="social-icons">
                      <a href="#" style={{ marginLeft: '0.5rem', fontSize: '1.5rem', color: 'white' }}>
                        <i className="fab fa-facebook-f"></i>
                      </a>
                      <a href="#" style={{ marginLeft: '0.5rem', fontSize: '1.5rem', color: 'white' }}>
                        <i className="fab fa-twitter"></i>
                      </a>
                      <a href="#" style={{ marginLeft: '0.5rem', fontSize: '1.5rem', color: 'white' }}>
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                      <a href="#" style={{ marginLeft: '0.5rem', fontSize: '1.5rem', color: 'white' }}>
                        <i className="fab fa-instagram"></i>
                      </a>
                    </div>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}