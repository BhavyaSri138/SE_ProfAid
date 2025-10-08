const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// Base test route
app.get("/", (req, res) => {
  res.send("ProfAid API is running...");
});

// ✅ Routes
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/professors", require("./routes/professorRoutes"));
app.use("/api/admins", require("./routes/adminRoutes"));
app.use("/api/subjects", require("./routes/subjectRoutes"));
app.use("/api/doubts", require("./routes/doubtRoutes"));
//app.use("/api/auth", require("./routes/authRoutes")); // for login

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
