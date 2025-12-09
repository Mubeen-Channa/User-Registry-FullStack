const User = require("../models/User");
const Role = require("../models/Role");

const getDashboardStats = async (req, res) => {
  try {
    const juniorRole = await Role.findOne({ role_name: "Junior" });
    const seniorRole = await Role.findOne({ role_name: "Senior" });
    const alumniRole = await Role.findOne({ role_name: "Alumni" });

    // Count users by role
    const totalStudents = await User.countDocuments({
      role_id: { $in: [juniorRole?._id, seniorRole?._id] }
    });

    const juniors = await User.countDocuments({ role_id: juniorRole?._id });
    const seniors = await User.countDocuments({ role_id: seniorRole?._id });
    const alumni = await User.countDocuments({ role_id: alumniRole?._id });

    res.json({
      totalStudents,
      juniors,
      seniors,
      alumni
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Error fetching statistics", error: err.message });
  }
};

module.exports = {
  getDashboardStats,
};