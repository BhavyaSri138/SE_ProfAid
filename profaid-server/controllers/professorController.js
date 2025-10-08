const Professor = require("../models/Professor");
const generateToken = require("../utils/generateToken");

const loginProfessor = async (req, res) => {
  const { Email, Password } = req.body;

  try {
    const professor = await Professor.findOne({ Email });

    if (professor && Password == professor.Password) {
      res.json({
        _id: professor._id,
        ProfessorID: professor.ProfessorID,
        Name: professor.Name,
        Department: professor.Department,
        Email: professor.Email,
        token: generateToken(professor._id, "Professor"),
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
    const professor = await Professor.findById(req.user._id);

    if (!professor) {
      return res.status(404).json({ message: "Professor not found" });
    }

    // Check old password
    if (professor.Password !== oldPassword) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Update password
    professor.Password = newPassword;
    await professor.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getProfessorByID = async (req, res) => {
  try {
    const professor = await Professor.findOne({ ProfessorID: req.params.id }).select("-Password");

    if (!professor) {
      return res.status(404).json({ message: "Professor not found" });
    }
    res.json(professor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { loginProfessor,changePassword,getProfessorByID };
