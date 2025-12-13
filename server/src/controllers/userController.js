const User = require("../models/User.js");
const cloudinary = require("../config/cloudinary.js");

// get all users 
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("role_id")
      .select("-password_hash -resetOtp -resetOtpExpires")
      .sort({ createdAt: -1 });

    const formattedUsers = users.map(user => ({
      id: user._id,
      cms: user.cms,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      department: user.department,
      role: user.role_id?.role_name,
      interest: user.interest,
      profileImage: user.profileImage,
      createdAt: user.createdAt
    }));

    res.json({ users: formattedUsers });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};


module.exports = { getAllUsers };