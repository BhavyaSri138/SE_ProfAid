const express = require("express");
const { loginProfessor,changePassword, getProfessorByID } = require("../controllers/professorController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginProfessor);

router.get("/profile", protect, (req, res) => {
  if (req.role !== "Professor") {
    return res.status(403).json({ message: "Access denied" });
  }
  res.json(req.user);
});
router.put("/change-password", protect, changePassword);
router.get("/:id",protect,getProfessorByID)
module.exports = router;
