const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { createDoubt, getStudentDoubts, getBranchDoubts,getDoubtByID,clarifyDoubt,extendDoubt,replyToDoubt,getUnclarifiedDoubts,getAllUnclarifiedDoubts } = require("../controllers/doubtController");
const { protect } = require("../middleware/authMiddleware");  // ← Add this import

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// POST /api/doubts -> Create a new doubt
router.post("/", upload.array("files"), createDoubt);

// GET /api/doubts/student/:studentID -> Get all doubts of a student
router.get("/unclarified", protect, getUnclarifiedDoubts);
router.get("/unclarified-all", getAllUnclarifiedDoubts)
router.get("/student/:studentID", getStudentDoubts);
router.get("/branch/:branch/:studentID", getBranchDoubts);
router.patch("/clarify/:doubtID", clarifyDoubt);
router.patch("/extend/:doubtID", upload.array("files"), extendDoubt);
router.patch('/reply/:doubtID', upload.array('Files'), replyToDoubt);

router.get("/:doubtID", getDoubtByID);


module.exports = router;
