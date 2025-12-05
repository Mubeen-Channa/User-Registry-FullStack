const bcrypt = require("bcryptjs");
const User = require("../models/User.js");
const Role = require("../models/Role.js");


// Register
const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, department, role_name, interest } = req.body;
    
    // Check if email already exists
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Find or create role based on role_name
    let role = await Role.findOne({ role_name: role_name });
    
    // If role doesn't exist, create it automatically
    if (!role) {
      role = await Role.create({ role_name: role_name });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // Store email in lowercase
      password_hash: hashedPassword,
      department,
      role_id: role._id,
      interest
    });

    res.status(201).json({ 
      message: "User registered successfully", 
      user: {
        id: newUser._id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        role: role.role_name,
      }
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Registration failed. Please try again.", error: err.message });
  }
};


module.exports = { registerUser };