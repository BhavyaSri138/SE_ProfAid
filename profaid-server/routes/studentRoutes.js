const express = require("express");
const { loginStudent } = require("../controllers/studentController");
const { protect } = require("../middleware/authMiddleware");
const { changePassword } = require("../controllers/studentController");
const router = express.Router();

router.post("/login", loginStudent);

// ✅ Protected route
router.get("/profile", protect, (req, res) => {
  if (req.role !== "Student") {
    return res.status(403).json({ message: "Access denied" });
  }
  res.json(req.user);
});
router.put("/change-password", protect, changePassword);
module.exports = router;
