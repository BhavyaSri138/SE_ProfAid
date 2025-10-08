const Student = require("../models/Student");
const generateToken = require("../utils/generateToken");

// @desc    Student Login
// @route   POST /api/students/login
// @access  Public


const loginStudent = async (req, res) => {
  const { Email, Password } = req.body;

  try {
    const student = await Student.findOne({ Email });

    // 🔑 Compare plain text directly
    if (student && Password === student.Password) {
      res.json({
        _id: student._id,
        StudentID: student.StudentID,
        Name: student.Name,
        Branch: student.Branch,
        Email: student.Email,
        token: generateToken(student._id, "Student"),
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
    const student = await Student.findById(req.user._id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check old password
    if (student.Password !== oldPassword) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Update password
    student.Password = newPassword;
    await student.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { loginStudent,changePassword };
