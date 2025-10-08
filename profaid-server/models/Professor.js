const mongoose = require("mongoose");

const professorSchema = new mongoose.Schema({
    ProfessorID: { type: String, required: true, unique: true },
    Name: { type: String, required: true },
    Department: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    PhoneNumber: { type: String },
    Password: { type: String, required: true },
    Subjects: [{ type: String }]   // e.g., ["Java", "Python"]
});

module.exports = mongoose.model("Professor", professorSchema);
