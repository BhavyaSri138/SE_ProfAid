const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    SubjectID: { type: String, required: true, unique: true },
    SubjectName: { type: String, required: true },
    Departments: { type: [String], required: true },
    BelongsTo: {type: String,required: true}
});

module.exports = mongoose.model("Subject", subjectSchema);
