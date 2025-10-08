const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Professor = require("../models/Professor");
const Admin = require("../models/Admin");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach user to request depending on role
      if (decoded.role === "Student") {
        req.user = await Student.findById(decoded.id).select("-Password");
      } else if (decoded.role === "Professor") {
        req.user = await Professor.findById(decoded.id).select("-Password");
      } else if (decoded.role === "Admin") {
        req.user = await Admin.findById(decoded.id).select("-Password");
      }

      req.role = decoded.role;
      next();
    } catch (error) {
      
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
