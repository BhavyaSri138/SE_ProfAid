import { useEffect, useState } from "react";
import { FaFileAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";

// Import Bootstrap components
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
  Spinner,
  Alert,
} from "react-bootstrap";

// Define the custom styles that mimic the image's aesthetic
const customStyles = `
  /* 1. Gradient Background (NOW USING YOUR EXACT GRADIENT) */
  .prof-aid-bg {
    background: linear-gradient(135deg, #FF7B54 0%, #FFB547 50%, #FFD28A 100%);
    min-height: 100vh;
    color: #333333; /* Dark text for contrast */
  }

  /* 2. Primary Accent Color (Coral/Button color) */
  .btn-prof-aid, .btn-prof-aid:hover, .btn-prof-aid:focus {
    /* Using the deep coral from the gradient's start point for buttons */
    background-color: #FF7B54 !important; 
    border-color: #FF7B54 !important;
    color: white !important;
  }
  
  /* 3. Text and Accent Color */
  .prof-aid-text-accent {
      /* Using a rich color for titles/emphasis */
      color: #D84315 !important; 
  }
  .prof-aid-subtitle {
    color: #333333; /* Dark text for subtitles */
  }

  /* 4. Card Styling (Clean White, Rounded, Shadow) */
  .prof-aid-card {
    border: none;
    border-radius: 12px; 
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
  }
  
  /* 5. Search Container Styling - slightly opaque white on top of the gradient */
  .search-container {
    background-color: rgba(255, 255, 255, 0.8); 
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  /* Custom styling for the main dashboard title */
  .main-dashboard-title {
    font-size: 3.5rem;
    font-weight: 700;
    color: white;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    margin-bottom: 3rem;
    text-align: center;
    padding-top: 2rem;
  }
`;

const AdminDashboard = () => {
  const [unclarifiedDoubts, setUnclarifiedDoubts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchID, setSearchID] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);

  const navigate = useNavigate();

  // Helper for consistent API calls and alert handling (unchanged)
  const handleApiCall = async (url, method = 'GET', body = null) => {
    setAlertMessage(null);
    const token = localStorage.getItem("authToken");
    
    try {
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        const res = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null,
        });

        const data = await res.json();
        
        if (!res.ok) {
            setAlertMessage({ type: 'danger', message: data.message || 'An error occurred.' });
            return { success: false, data: null };
        }
        return { success: true, data };

    } catch (err) {
        console.error("API Call Error:", err);
        setAlertMessage({ type: 'danger', message: 'Network or server error.' });
        return { success: false, data: null };
    }
  };

  // 🔹 Search by ID (unchanged)
  const handleSearchByID = async () => {
    if (!searchID.trim()) return setAlertMessage({ type: 'warning', message: "Please enter an ID" });
    
    const { success, data } = await handleApiCall(
        `http://localhost:5000/api/admins/search/id?ID=${searchID}`
    );

    if (success) {
      setSearchResults([data]);
    } else {
      setSearchResults([]);
    }
  };

  // 🔹 Search by Name (unchanged)
  const handleSearchByName = async () => {
    if (!searchName.trim()) return setAlertMessage({ type: 'warning', message: "Please enter a name" });
    
    const { success, data } = await handleApiCall(
        `http://localhost:5000/api/admins/search/name?name=${searchName}`
    );

    if (success) {
      setSearchResults([...data.students, ...data.professors]);
    } else {
      setSearchResults([]);
    }
  };

  // 🔹 Fetch unclarified doubts (unchanged)
  useEffect(() => {
    const fetchUnclarifiedDoubts = async () => {
      setLoading(true);
      try {
        const { success, data } = await handleApiCall(
            "http://localhost:5000/api/doubts/unclarified-all"
        );
        
        if (success) {
          setUnclarifiedDoubts(data);
        } else {
          setUnclarifiedDoubts([]);
        }
      } catch (err) {
        // Error already handled in handleApiCall
      } finally {
        setLoading(false);
      }
    };

    fetchUnclarifiedDoubts();
  }, []);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center prof-aid-bg" style={{height: "100vh"}}>
        <Spinner animation="border" variant="light" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );

  return (
    <div className="prof-aid-bg">
      {/* Inject custom styles for the theme */}
      <style>{customStyles}</style>
      
      <AdminNavbar />

      <h1 className="main-dashboard-title">Admin Dashboard</h1>

      <Container className="py-2">
        
        {/* Global Alert for Search/API messages */}
        {alertMessage && (
            <Alert 
                variant={alertMessage.type} 
                onClose={() => setAlertMessage(null)} 
                dismissible
                className="mb-4"
            >
                {alertMessage.message}
            </Alert>
        )}
        
        {/* Main Layout Row */}
        <Row>
          {/* Left Column (Search and Results) */}
          <Col lg={6} className="mb-4 mb-lg-0">
            
            <Button
              onClick={() => navigate("/manage-professors")}
              className="mb-4 btn-prof-aid" 
            >
              Manage Professors
            </Button>

            {/* Search Section - Semi-transparent white background */}
            <div className="mb-5 search-container">
              <h4 className="mb-3 prof-aid-text-accent">Search Users & View Details</h4>
              
              {/* Search by ID */}
              <Form.Group className="mb-3">
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Enter Student or Professor ID"
                    value={searchID}
                    onChange={(e) => setSearchID(e.target.value)}
                  />
                  <Button onClick={handleSearchByID} className="btn-prof-aid">
                    Search by ID
                  </Button>
                </InputGroup>
              </Form.Group>

              {/* Search by Name */}
              <Form.Group>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Enter Name (partial, case-insensitive)"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                  <Button onClick={handleSearchByName} className="btn-prof-aid">
                    Search Name
                  </Button>
                </InputGroup>
              </Form.Group>
            </div>
            
            {/* Search Results */}
            <h3 className="mb-3 prof-aid-text-accent">Search Results</h3>
            <Row>
              {searchResults.length === 0 ? (
                <Col><p className="text-muted">No results to display.</p></Col>
              ) : (
                searchResults.map((person, idx) => (
                  <Col md={6} key={idx}>
                    <Card className="mb-3 prof-aid-card">
                      <Card.Body>
                        <Card.Title className="prof-aid-text-accent small mb-1">
                          {person.Name}
                        </Card.Title>
                        <Card.Subtitle className="mb-1 text-danger small">
                            Type: {person.Type || (person.StudentID ? "Student" : "Professor")}
                        </Card.Subtitle>
                        <Card.Text as="div" className="small text-secondary">
                          <p className="mb-0">
                            <strong>ID:</strong>{" "}
                            {person.ID || person.StudentID || person.ProfessorID}
                          </p>
                          <p className="mb-0">
                            <strong>Email:</strong> {person.Email}
                          </p>
                          {person.Branch && <p className="mb-0"><strong>Branch:</strong> {person.Branch}</p>}
                          {person.Department && <p className="mb-0"><strong>Department:</strong> {person.Department}</p>}
                          <p className="mb-0">
                            Password: ******
                          </p>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              )}
            </Row>
          </Col>

          {/* Right Column (Unclarified Doubts) */}
          <Col lg={6}>
            <h3 className="mb-3 prof-aid-text-accent">
              Unclarified Doubts ⚠️
            </h3>
            {unclarifiedDoubts.length === 0 ? (
              <p className="text-muted">No unclarified doubts found.</p>
            ) : (
              unclarifiedDoubts.map((doubt, idx) => (
                <Card key={idx} className="mb-3 prof-aid-card">
                  <Card.Body>
                    <Card.Title className="prof-aid-text-accent small mb-1">{doubt.Title}</Card.Title>
                    <Card.Text as="div" className="small text-secondary">
                      <p className="mb-0">
                        <strong>Student ID:</strong> {doubt.StudentID}
                      </p>
                      <p className="mb-0">
                        <strong>Subject:</strong> {doubt.Subject}
                      </p>
                      <p className="mb-0">
                        <strong>Status:</strong>{" "}
                        <span className="text-danger fw-bold">{doubt.Status}</span>
                      </p>
                    </Card.Text>
                    {doubt.FilesAttached?.length > 0 && (
                      <div className="mt-2">
                        <h6 className="card-subtitle mb-1 text-muted small">Files:</h6>
                        {doubt.FilesAttached.map((file, fileIdx) => (
                          <div key={fileIdx}>
                            <a
                              href={`http://localhost:5000/uploads/${file}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary d-flex align-items-center gap-1 small"
                            >
                              <FaFileAlt /> {file}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              ))
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;