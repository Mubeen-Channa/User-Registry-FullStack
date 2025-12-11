const User = require("../models/User");
const Profile = require("../models/Profile");

exports.userProfile = async (req, res) => {
  try {
    const { cms } = req.params;

    const user = await User.findOne({ cms }).populate("role_id", "role_name");

    if (!user) return res.status(404).json({ message: "User not found" });

    const profile = await Profile.findOne({ user_id: user._id }) || {};

    return res.json({
      name: `${user.first_name} ${user.last_name}`,
      cms: user.cms,
      email: user.email,
      role: user.role_id ? user.role_id.role_name : "N/A",
      department: user.department,
      // interest: user.interest,
      // joinDate: user.createdAt,
      
      // profile model fields
      rank: profile?.rank || "",
      about: profile.about || "",
      skills: profile.skills || [],
      posts: profile.posts || 0,
      connections: profile.connections || 0,
      mentors: profile.mentors || [],
      graduating_year: profile.graduating_year || null,
      address: profile.address || "",
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
