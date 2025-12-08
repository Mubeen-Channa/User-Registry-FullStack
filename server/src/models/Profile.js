const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    unique: true 
  },

  role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  
  rank: { type: String, default: "100%" },

  about: { type: String, default: "" },
  
  posts: { type: Number, default: 0 },
  connections: { type: Number, default: 0 },
  mentors: { type: [String], default: [] },
  
  skills: { type: [String], default: [] },
  
  graduating_year: { type: Number },
  address: { type: String, default: "" },

}, { timestamps: true });

module.exports = mongoose.model("Profile", profileSchema);
