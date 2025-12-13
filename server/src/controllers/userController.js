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


// upload profile image to Cloudinary
const updateProfileImage = async (req, res) => {
  try {
    const { userId, imageData } = req.body;

    if (!imageData) {
      return res.status(400).json({ message: "No image data provided" });
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(imageData, {
      folder: "user-profiles",
      transformation: [
        { width: 400, height: 400, crop: "fill" }, // Auto resize
        { quality: "auto" }, 
        { fetch_format: "auto" } 
      ]
    });

    // Update user with Cloudinary URL
    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: uploadResult.secure_url }, // Store URL in MongoDB
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ 
      message: "Profile image updated successfully",
      profileImage: user.profileImage
    });
  } catch (err) {
    console.error("Error updating profile image:", err);
    res.status(500).json({ message: "Failed to update profile image" });
  }
};

module.exports = { getAllUsers, updateProfileImage };