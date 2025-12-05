const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // General email format validation
  },
  password_hash: { type: String, required: true },
  department: { type: String },
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  interest: { type: String },
  profileImage: { type: String, default: null },
  
  // Fields for Reset password
  resetOtp: { type: Number, default: null },
  resetOtpExpires: { type: Date, default: null }
  
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);