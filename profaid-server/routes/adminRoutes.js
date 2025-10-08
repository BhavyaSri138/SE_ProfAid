const express = require("express");
const { loginAdmin,changePassword,searchByID,searchByName,getDepartments,getProfessors,
  addProfessor,
  updateProfessor,
  deleteProfessor,
  getSubjectsByBelongsTo,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginAdmin);

router.get("/profile", protect, (req, res) => {
  if (req.role !== "Admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  res.json(req.user);
});
router.put("/change-password", protect, changePassword);
router.get("/search/id", searchByID);
router.get("/search/name", searchByName);
router.get("/departments", getDepartments);
router.get("/professors", getProfessors);
router.post("/professors", addProfessor);
router.put("/professors/:id", updateProfessor);
router.delete("/professors/:id", deleteProfessor);
router.get("/subjects/belongsto/:belongsTo", getSubjectsByBelongsTo);

module.exports = router;
