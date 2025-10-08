const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");

// GET subjects by department
router.get("/", async (req, res) => {
  try {
    const department = req.query.branch; // frontend still sends ?branch=CSE
    if (!department) {
      return res.status(400).json({ message: "Branch/Department is required" });
    }

    // ✅ match Department in DB
    const subjects = await Subject.find({ Departments: department }).select("SubjectID SubjectName -_id");
    res.json(subjects.map(sub => sub.SubjectName));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
