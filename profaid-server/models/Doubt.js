const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
    SenderID: { type: String, required: true },   // StudentID / ProfessorID
    Message: { type: String },
    FilesAttached: [{ type: String }], // file URLs or paths
    RepliedAt: { type: Date, default: Date.now }
});

const doubtSchema = new mongoose.Schema({
    DoubtID: { type: String, required: true, unique: true },
    StudentID: { type: String, required: true },
    Subject: { type: String, required: true },
    Title: { type: String, required: true },
    Description: { type: String, required: true },
    FilesAttached: [{ type: String }],
    CreatedAt: { type: Date, default: Date.now },
    Replies: [replySchema],
    Status: { type: String, enum: ["Open", "Replied", "Clarified"], default: "Open" }
});

module.exports = mongoose.model("Doubt", doubtSchema);
