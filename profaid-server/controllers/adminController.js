const Admin = require("../models/Admin");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
const Professor = require("../models/Professor");
const generateToken = require("../utils/generateToken");
const loginAdmin = async (req, res) => {
  const { Email, Password } = req.body;

  try {
    const admin = await Admin.findOne({ Email });

    if (admin && Password == admin.Password) {
      res.json({
        _id: admin._id,
        AdminID: admin.AdminID,
        AdminName: admin.AdminName,
        Email: admin.Email,
        token: generateToken(admin._id, "Admin"),
      });
    } else {
      res.status(401).json({ message: "Invalid Email or Password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const admin = await Admin.findById(req.user._id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check old password
    if (admin.Password !== oldPassword) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Update password
    admin.Password = newPassword;
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchByID = async (req, res) => {
  try {
    const { ID } = req.query;

    const student = await Student.findOne({ StudentID: ID });
    if (student) {
      return res.status(200).json({
        Type: "Student",
        ID: student.StudentID,
        Name: student.Name,
        Email: student.Email,
        Branch: student.Branch,
        Password: student.Password,
      });
    }

    const professor = await Professor.findOne({ ProfessorID: ID });
    if (professor) {
      return res.status(200).json({
        Type: "Professor",
        ID: professor.ProfessorID,
        Name: professor.Name,
        Email: professor.Email,
        Department:professor.Department,
        PhoneNumber: professor.PhoneNumber,
        Password: professor.Password,
      });
    }

    return res.status(404).json({ message: "No student or professor found with this ID" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const searchByName = async (req, res) => {
  try {
    const { name } = req.query;
    const regex = new RegExp(name, "i");

    const students = await Student.find(
      { Name: { $regex: regex } },
      "StudentID Name Email Branch Password"
    );

    const professors = await Professor.find(
      { Name: { $regex: regex } },
      "ProfessorID Name Email Department PhoneNumber Password"
    );

    res.status(200).json({ students, professors });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// GET /api/admins/departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Professor.distinct("Department");
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching departments" });
  }
};

const addProfessor = async (req, res) => {
  try {
    const { ProfessorID, Name, Email, Password, Department, Subjects } = req.body;

    if (!ProfessorID || !Name || !Email || !Password || !Department) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Professor.findOne({ ProfessorID });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Professor with this ID already exists" });
    }

    const subjectIDs = Array.isArray(Subjects) ? Subjects : [];

    const newProfessor = new Professor({
      ProfessorID,
      Name,
      Email,
      Password,
      Department,
      Subjects: subjectIDs, // ✅ only IDs stored
    });

    await newProfessor.save();

    // ✅ attach subject names before sending back
    const subjectDocs = await Subject.find({ SubjectID: { $in: subjectIDs } });
    const response = {
      ...newProfessor.toObject(),
      SubjectNames: subjectDocs.map((s) => s.SubjectName),
    };

    res.status(201).json(response);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding professor", error: err.message });
  }
};

// UPDATE PROFESSOR
const updateProfessor = async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, Email, Department, Subjects } = req.body;

    const subjectIDs = Array.isArray(Subjects) ? Subjects : [];

    const updated = await Professor.findByIdAndUpdate(
      id,
      { Name, Email, Department, Subjects: subjectIDs },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Professor not found" });

    // ✅ attach subject names
    const subjectDocs = await Subject.find({ SubjectID: { $in: subjectIDs } });
    const response = {
      ...updated.toObject(),
      SubjectNames: subjectDocs.map((s) => s.SubjectName),
    };

    res.json(response);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating professor", error: err.message });
  }
};

// GET PROFESSORS (populate subject names)
const getProfessors = async (req, res) => {
  try {
    const { department } = req.query;
    let query = {};
    if (department) query.Department = department;

    const professors = await Professor.find(query).sort({ ProfessorID: 1 });

    const profsWithSubjects = await Promise.all(
      professors.map(async (prof) => {
        const subjectDocs = await Subject.find({
          SubjectID: { $in: prof.Subjects },
        });
        return {
          ...prof.toObject(),
          SubjectNames: subjectDocs.map((s) => s.SubjectName), // ✅ names included
        };
      })
    );

    res.json(profsWithSubjects);
  } catch (err) {
    res.status(500).json({ message: "Error fetching professors" });
  }
};

// ✅ Delete professor
const deleteProfessor = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Professor.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Professor not found" });
    res.json({ message: "Professor deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting professor", error: err.message });
  }
};

// ✅ Get subjects of a department
const getSubjectsByBelongsTo = async (req, res) => {
  try {
    const { belongsTo } = req.params;
    const subjects = await Subject.find({ BelongsTo: belongsTo });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: "Error fetching subjects", error: err.message });
  }
};


module.exports = { loginAdmin, changePassword,searchByID, searchByName,getDepartments,getProfessors,addProfessor,updateProfessor,deleteProfessor,getSubjectsByBelongsTo };
