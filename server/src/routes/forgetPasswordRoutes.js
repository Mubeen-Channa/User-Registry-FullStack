const express = require("express");
const { forgotPassword } = require("../controllers/forgetPasswordController");
const { verifyOtp } = require("../controllers/verifyOTPController");
const { resetPasswordFinal } = require("../controllers/resetPasswordController");

const router = express.Router();

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPasswordFinal);

module.exports = router;
