import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaUserEdit, FaTrashAlt } from "react-icons/fa";
import AdminNavbar from "../components/AdminNavbar";

// Import Bootstrap components
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Table,
  Card,
  InputGroup,
  Spinner,
} from "react-bootstrap";

// Define the custom styles that mimic the image's aesthetic
const customStyles = `
  /* 1. Gradient Background (Warm Sunset) */
  .prof-aid-bg {
    background: linear-gradient(135deg, #FF7B54 0%, #FFB547 50%, #FFD28A 100%);
    min-height: 100vh;
    color: #333333; /* Dark text for contrast */
    padding-bottom: 40px; /* Space at the bottom */
  }

  /* 2. Primary Accent Color (Coral/Button color) */
  .btn-prof-aid, .btn-prof-aid:hover, .btn-prof-aid:focus {
    background-color: #FF7B54 !important; 
    border-color: #FF7B54 !important;
    color: white !important;
  }
  
  /* Danger button for Remove/Delete action */
  .btn-prof-aid-danger {
    background-color: #D84315 !important;
    border-color: #D84315 !important;
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
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
    background-color: #ffffff; /* Explicitly white */
    padding: 20px;
  }
  
  /* 5. Table Styling - striped, light hover, rounded corners */
  .prof-aid-table {
    background-color: #ffffff;
    border-radius: 12px;
    overflow: hidden; /* Important for rounding corners */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); 
  }

  .prof-aid-table thead th {
    background-color: #FFB547; /* Lighter gradient shade for table header */
    color: #333333;
    border-bottom: none;
  }

  .prof-aid-table tbody tr:hover {
    background-color: #fffaf0; /* Very light cream on hover */
  }
`;

const ManageProfessors = () => {
  const [professors, setProfessors] = useState([]);
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(null); // "add" or "edit"
  const [loading, setLoading] = useState(false); // ✅ Added loading state
  const [formData, setFormData] = useState({
    id: "",
    ProfessorID: "",
    Name: "",
    Email: "",
    Password: "",
    Department: "",
    Subjects: [], // always store SubjectIDs here
  });
  const [subjects, setSubjects] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  // Helper for consistent API calls (to handle auth/errors later if needed)
  const handleApiCall = async (url, method = 'GET', body = null) => {
    // In a real app, you'd add Authorization headers here
    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: body ? JSON.stringify(body) : null,
        });

        if (!res.ok) {
            throw new Error(`API call failed: ${res.statusText}`);
        }
        return res.json();

    } catch (err) {
        console.error("API Call Error:", err);
        alert(`Operation Failed: ${err.message}`);
        return null;
    }
  };

  // Fetch departments
  useEffect(() => {
    handleApiCall("http://localhost:5000/api/admins/departments")
      .then(data => data && setDepartments(data))
      .catch(console.error);
  }, []);

  // Fetch professors (sorted by numeric part of ProfessorID)
  useEffect(() => {
    const fetchProfessors = async () => {
      setLoading(true);
      let url = "http://localhost:5000/api/admins/professors";
      if (department) url += `?department=${department}`;

      const data = await handleApiCall(url);
      
      if (data) {
        const sorted = [...data].sort((a, b) => {
          const numA = parseInt(a.ProfessorID.replace(/\D/g, ""), 10);
          const numB = parseInt(b.ProfessorID.replace(/\D/g, ""), 10);
          return numA - numB;
        });
        setProfessors(sorted);
      }
      setLoading(false);
    }
    fetchProfessors();
  }, [department]);

  // Fetch subjects whenever Department changes
  useEffect(() => {
    if (formData.Department) {
      handleApiCall(`http://localhost:5000/api/admins/subjects/belongsto/${formData.Department}`)
        .then(data => setSubjects(data || []))
        .catch((err) => {
          console.error(err);
          setSubjects([]);
        });
    } else {
        setSubjects([]);
    }
  }, [formData.Department]);

  // Delete professor
  const handleDelete = async (prof) => {
    if (
      window.confirm(
        `Do you want to permanently remove ${prof.Name} (${prof.ProfessorID}) ?`
      )
    ) {
      const data = await handleApiCall(`http://localhost:5000/api/admins/professors/${prof._id}`, "DELETE");
      if (data) {
        setProfessors((prev) => prev.filter((p) => p._id !== prof._id));
      }
    }
  };

  // Handle Add/Edit form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = showForm === "edit" ? "PUT" : "POST";
    const url =
      showForm === "edit"
        ? `http://localhost:5000/api/admins/professors/${formData.id}`
        : "http://localhost:5000/api/admins/professors";

    const payload = {...formData};
    // Clean up unnecessary fields for API call
    delete payload.id;
    if(method === 'PUT' && !payload.Password) delete payload.Password; // Don't send empty password on edit
    
    const updated = await handleApiCall(url, method, payload);

    if (updated) {
      // Re-fetch professors to ensure table is fully updated and sorted correctly
      setDepartment(department); // Trigger the useEffect hook with the current department filter
      setShowForm(null);
    }
  };
  
  // Setup form data for editing
  const handleEditClick = (prof) => {
      setShowForm("edit");
      setShowPassword(false);
      setFormData({
          id: prof._id,
          ProfessorID: prof.ProfessorID || "",
          Name: prof.Name || "",
          Email: prof.Email || "",
          Password: "", // Never populate password field
          Department: prof.Department || "",
          Subjects: prof.Subjects || [], // keep SubjectIDs
      });
  }

  // Setup form data for adding
  const handleAddClick = () => {
      setShowForm("add");
      setShowPassword(false);
      setFormData({
          id: "",
          ProfessorID: "",
          Name: "",
          Email: "",
          Password: "",
          Department: "",
          Subjects: [],
      });
  }


  return (
    <div className="prof-aid-bg">
      {/* Inject custom styles for the theme */}
      <style>{customStyles}</style>
      
      <AdminNavbar />

      <Container className="py-5">
        <h2 className="mb-4 prof-aid-text-accent">Manage Professors 🧑‍🏫</h2>

        <Row className="mb-4">
          <Col lg={4} className="mb-3 mb-lg-0">
            {/* Department Filter */}
            <Form.Group as={Row}>
              <Form.Label column sm="4" className="fw-bold">
                Filter Dept:
              </Form.Label>
              <Col sm="8">
                <Form.Select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="prof-aid-card p-2"
                >
                  <option value="">-- All Departments --</option>
                  {departments.map((dept, i) => (
                    <option key={i} value={dept}>
                      {dept}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>
          </Col>
          <Col lg={8} className="text-lg-end">
            <Button 
                onClick={handleAddClick}
                className="btn-prof-aid"
            >
              + Add New Professor
            </Button>
          </Col>
        </Row>

        {/* Form Section */}
        {showForm && (
          <Card className="mb-5 prof-aid-card">
            <Card.Body>
              <Card.Title className="prof-aid-text-accent mb-3">
                {showForm === "edit" ? "Edit Professor" : "Add Professor"}
              </Card.Title>
              <Form onSubmit={handleSubmit}>
                <Row className="g-3 mb-3">
                  {/* ID, Name, Email */}
                  <Col md={4}>
                    <Form.Control
                      type="text"
                      placeholder="Professor ID (e.g., P001)"
                      value={formData.ProfessorID}
                      disabled={showForm === "edit"}
                      onChange={(e) => setFormData({ ...formData, ProfessorID: e.target.value })}
                      required
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Control
                      type="text"
                      placeholder="Full Name"
                      value={formData.Name}
                      onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                      required
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      value={formData.Email}
                      onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                      required
                    />
                  </Col>

                  {/* Password (only for Add) */}
                  {showForm === "add" && (
                    <Col md={4}>
                      <InputGroup>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={formData.Password}
                          onChange={(e) => setFormData({ ...formData, Password: e.target.value })}
                          required={showForm === "add"}
                        />
                        <Button 
                            variant="outline-secondary" 
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ borderColor: "#FFB547" }}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                      </InputGroup>
                    </Col>
                  )}
                  {showForm === "edit" && (
                     <Col md={4}>
                        <Form.Control
                          type="password"
                          placeholder="Leave blank to keep current password"
                          value={formData.Password}
                          onChange={(e) => setFormData({ ...formData, Password: e.target.value })}
                        />
                     </Col>
                  )}
                </Row>

                {/* Department & Subjects */}
                <Row className="g-3 mb-4 align-items-center">
                    <Col md={4}>
                        <Form.Select
                          value={formData.Department}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              Department: e.target.value,
                              Subjects: [], // Clear subjects on dept change
                            })
                          }
                          required
                        >
                          <option value="">-- Select Department --</option>
                          {departments.map((dept, i) => (
                            <option key={i} value={dept}>
                              {dept}
                            </option>
                          ))}
                        </Form.Select>
                    </Col>
                    
                    <Col md={8}>
                        {formData.Department && subjects.length > 0 && (
                          <div className="d-flex flex-wrap gap-3 p-2 border rounded">
                            <strong className="prof-aid-text-accent me-2">Subjects:</strong>
                            {subjects.map((sub) => (
                              <Form.Check
                                key={sub.SubjectID}
                                type="checkbox"
                                id={`sub-${sub.SubjectID}`}
                                label={sub.SubjectName}
                                checked={formData.Subjects.includes(sub.SubjectID)}
                                onChange={(e) => {
                                  let updatedSubjects = [...formData.Subjects];
                                  if (e.target.checked)
                                    updatedSubjects.push(sub.SubjectID);
                                  else
                                    updatedSubjects = updatedSubjects.filter(
                                      (s) => s !== sub.SubjectID
                                    );
                                  setFormData({ ...formData, Subjects: updatedSubjects });
                                }}
                              />
                            ))}
                          </div>
                        )}
                        {formData.Department && subjects.length === 0 && (
                            <p className="text-muted small m-0">No subjects available for this department.</p>
                        )}
                        {!formData.Department && (
                            <p className="text-muted small m-0">Select a Department to view subjects.</p>
                        )}
                    </Col>
                </Row>
                
                <div className="d-flex gap-2">
                    <Button type="submit" className="btn-prof-aid">
                      {showForm === "edit" ? "Update Professor" : "Add Professor"}
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => setShowForm(null)}>
                      Cancel
                    </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        )}

        {/* Professors Table */}
        <Card className="prof-aid-card p-0">
          {loading ? (
            <div className="d-flex justify-content-center p-5">
              <Spinner animation="border" variant="secondary" role="status" />
            </div>
          ) : (
            <Table responsive hover className="prof-aid-table mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Subjects Taught</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {professors.length === 0 ? (
                    <tr>
                        <td colSpan="6" className="text-center text-muted p-4">
                            No professors found {department ? `in ${department} department.` : '.'}
                        </td>
                    </tr>
                ) : (
                    professors.map((prof) => (
                      <tr key={prof._id}>
                        <td className="fw-bold">{prof.ProfessorID}</td>
                        <td>{prof.Name}</td>
                        <td>{prof.Email}</td>
                        <td>{prof.Department}</td>
                        <td>
                          {prof.SubjectNames && prof.SubjectNames.length > 0
                            ? prof.SubjectNames.join(", ")
                            : <span className="text-muted fst-italic">None Assigned</span>}
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => handleEditClick(prof)}
                                className="border-0 text-primary p-1"
                                title="Edit"
                              >
                                <FaUserEdit />
                              </Button>
                              <Button 
                                size="sm" 
                                className="btn-prof-aid-danger border-0 p-1"
                                onClick={() => handleDelete(prof)}
                                title="Remove"
                              >
                                <FaTrashAlt />
                              </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </Table>
          )}
        </Card>
      </Container>
    </div>
  );
};

export default ManageProfessors;