const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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


// Login 
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email (case-insensitive)
    const user = await User.findOne({ email: email.toLowerCase() }).populate("role_id"); 
    if (!user) {
      return res.status(400).json({ message: "User doesn't exist!" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token with email
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        cms: user.cms,
        department: user.department,
        role: user.role_id?.role_name || "user",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        cms: user.cms,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        department: user.department,
        role: user.role_id?.role_name,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed. Please try again.", error: err.message });
  }
};

module.exports = { registerUser, loginUser };