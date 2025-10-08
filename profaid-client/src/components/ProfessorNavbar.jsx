import { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

const ProfessorNavbar = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const professorID = localStorage.getItem("ID") || "";
  const name = localStorage.getItem("Name") || "";
  const email = localStorage.getItem("Email") || "";
  const department = localStorage.getItem("Department") || "";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        background: "#1976d2",
        color: "white",
      }}
    >
      <h2>ProfAid</h2>

      <div ref={dropdownRef} style={{ position: "relative", cursor: "pointer" }}>
        <FaUserCircle
          size={28}
          color="white"
          onClick={() => setShowProfileDropdown((prev) => !prev)}
        />
        {showProfileDropdown && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              background: "red",
              color: "black",
              border: "1px solid #ccc",
              padding: "10px",
              minWidth: "220px",
              zIndex: 1000,
              borderRadius: "6px",
            }}
          >
            <p><strong>ID:</strong> {professorID}</p>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Department:</strong> {department}</p>
            <hr />
            <button
              onClick={() => (window.location.href = "/change-password")}
              style={{
                display: "block",
                width: "100%",
                margin: "5px 0",
                padding: "6px",
              }}
            >
              Change Password
            </button>
            <button
              onClick={handleLogout}
              style={{
                display: "block",
                width: "100%",
                margin: "5px 0",
                padding: "6px",
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ProfessorNavbar;
