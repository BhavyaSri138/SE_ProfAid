const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    AdminID: { type: String, required: true, unique: true },
    AdminName:{type:String, required:true},
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true }
});

module.exports = mongoose.model("Admin", adminSchema);
