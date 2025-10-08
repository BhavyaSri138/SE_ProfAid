const Doubt = require("../models/Doubt");
const Student = require("../models/Student");
const SubjectModel = require("../models/Subject");
const Professor = require("../models/Professor");
const sendEmail = require("../utils/sendEmail");

// ✅ Create Doubt
const createDoubt = async (req, res) => {
  try {
    const { DoubtID, StudentID, Subject: subjectName, Title, Description } = req.body;
    const filesAttached = (req.files || []).map((file) => file.filename);

    // Find subject
    const subject = await SubjectModel.findOne({ SubjectName: subjectName });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // Save doubt
    const newDoubt = new Doubt({
      DoubtID,
      StudentID,
      Subject: subjectName,
      Title,
      Description,
      FilesAttached: filesAttached,
      Replies: [],
      CreatedAt: Date.now(),
    });

    await newDoubt.save();

    // Fetch student info
    const student = await Student.findOne({ StudentID });
    // Fetch professors who handle this subject
    const professors = await Professor.find({ Subjects: subject.SubjectID });

    // Send email to professors
    professors.forEach((prof) => {
      if (prof.Email) {
        sendEmail({
          to: prof.Email,
          subject: `New Doubt in ${subject.SubjectName}`,
          text: `A new doubt is posted on ${subject.SubjectName} by ${student?.Name} (${student?.StudentID}) at ${newDoubt.CreatedAt}`,
        }).catch(console.error);
      }
    });

    res.status(201).json({ message: "Doubt saved successfully!" });
  } catch (error) {
    console.error("❌ createDoubt Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Student Doubts
const getStudentDoubts = async (req, res) => {
  try {
    const { studentID } = req.params;
    const doubts = await Doubt.find({ StudentID: studentID }).sort({ CreatedAt: -1 });
    res.json(doubts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Branch Doubts (excluding own)
const getBranchDoubts = async (req, res) => {
  try {
    const { branch, studentID } = req.params;

    const studentsInBranch = await Student.find({
      Branch: branch,
      StudentID: { $ne: studentID },
    }).select("StudentID");

    const studentIDs = studentsInBranch.map((student) => student.StudentID);

    const doubts = await Doubt.find({
      StudentID: { $in: studentIDs },
    }).sort({ CreatedAt: -1 });

    res.json(doubts);
  } catch (err) {
    console.error("Error in getBranchDoubts:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get Doubt by ID
const getDoubtByID = async (req, res) => {
  try {
    const { doubtID } = req.params;
    const doubt = await Doubt.findOne({ DoubtID: doubtID });

    if (!doubt) return res.status(404).json({ message: "Doubt not found" });

    res.json(doubt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Clarify Doubt
const clarifyDoubt = async (req, res) => {
  try {
    const { doubtID } = req.params;
    const doubt = await Doubt.findOne({ DoubtID: doubtID });

    if (!doubt) return res.status(404).json({ message: "Doubt not found" });

    doubt.Status = "Clarified";
    await doubt.save();

    res.json(doubt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Extend Doubt (Student extends)
const extendDoubt = async (req, res) => {
  try {
    const { doubtID } = req.params;
    const { Message, SenderID } = req.body;
    const filesAttached = (req.files || []).map((file) => file.filename);

    if (!Message || !SenderID) {
      return res.status(400).json({ message: "Message and SenderID are required" });
    }

    const doubt = await Doubt.findOne({ DoubtID: doubtID });
    if (!doubt) return res.status(404).json({ message: "Doubt not found" });
    if (doubt.Status === "Clarified") {
      return res.status(400).json({ message: "Cannot extend a clarified doubt" });
    }

    const newReply = { SenderID, Message, FilesAttached: filesAttached };
    doubt.Replies.push(newReply);
    doubt.Status = "Open"; // Student extends → stays open

    await doubt.save();

    // 🔔 Email professors when extended
    const subjectDoc = await SubjectModel.findOne({ SubjectName: doubt.Subject });
    const student = await Student.findOne({ StudentID: SenderID });
    const professors = await Professor.find({ Subjects: subjectDoc.SubjectID });

    professors.forEach((prof) => {
      if (prof.Email) {
        sendEmail({
          to: prof.Email,
          subject: `Doubt extended in ${doubt.Subject}`,
          text: `The doubt on ${doubt.Subject} was extended by ${student?.Name} (${student?.StudentID}) at ${new Date().toLocaleString()}`,
        }).catch(console.error);
      }
    });

    res.json(doubt);
  } catch (err) {
    console.error("ExtendDoubt Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Reply to Doubt (Professor replies)
const replyToDoubt = async (req, res) => {
  try {
    const { doubtID } = req.params;
    const { Message, SenderID } = req.body;
    const filesAttached = (req.files || []).map((file) => file.filename);

    if (!Message || !SenderID) {
      return res.status(400).json({ message: "Message and SenderID are required" });
    }

    const doubt = await Doubt.findOne({ DoubtID: doubtID });
    if (!doubt) return res.status(404).json({ message: "Doubt not found" });
    if (doubt.Status === "Clarified") {
      return res.status(400).json({ message: "Cannot reply to a clarified doubt" });
    }

    const newReply = { SenderID, Message, FilesAttached: filesAttached };
    doubt.Replies.push(newReply);
    doubt.Status = "Replied"; // Professor reply → marked as Replied

    await doubt.save();

    // 🔔 Email student when professor replies
    if (SenderID.startsWith("P")) {
      const student = await Student.findOne({ StudentID: doubt.StudentID });
      if (student?.Email) {
        sendEmail({
          to: student.Email,
          subject: `Reply to your doubt in ${doubt.Subject}`,
          text: `Professor replied on ${new Date().toLocaleString()} for your doubt in ${doubt.Subject}.`,
        }).catch(console.error);
      }
    }

    res.json(doubt);
  } catch (err) {
    console.error("ReplyToDoubt Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get Unclarified Doubts by Subject
const getUnclarifiedDoubts = async (req, res) => {
  try {
    const subjects = req.query.subjects?.split(",") || [];
    if (subjects.length === 0) {
      return res.status(400).json({ message: "Subjects query param is required" });
    }

    const subjectDocs = await SubjectModel.find({ SubjectID: { $in: subjects } }).select("SubjectName");
    const subjectNames = subjectDocs.map((sub) => sub.SubjectName);

    const doubts = await Doubt.find({
      Subject: { $in: subjectNames },
      Status: { $ne: "Clarified" },
    });

    res.status(200).json(doubts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Unclarified Doubts
const getAllUnclarifiedDoubts = async (req, res) => {
  try {
    const doubts = await Doubt.find({ Status: { $ne: "Clarified" } });
    res.status(200).json(doubts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDoubt,
  getStudentDoubts,
  getBranchDoubts,
  getDoubtByID,
  clarifyDoubt,
  extendDoubt,
  replyToDoubt,
  getUnclarifiedDoubts,
  getAllUnclarifiedDoubts,
};
