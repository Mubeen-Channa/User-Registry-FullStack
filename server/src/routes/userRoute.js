const express = require("express");
const router = express.Router();

const { userProfile } = require("../controllers/userProfileController.js");

router.get("/profile/:cms",  userProfile);

module.exports = router;
