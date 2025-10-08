const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    StudentID: { type: String, required: true, unique: true },
    Name: { type: String, required: true },
    Branch: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    PhoneNumber: { type: String },
    Password: { type: String, required: true }
});

module.exports = mongoose.model("Student", studentSchema);
