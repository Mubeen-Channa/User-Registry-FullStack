const express = require("express");
const router = express.Router();

const { userProfile } = require("../controllers/userProfileController.js");
const { getAllUsers, updateProfileImage  } = require("../controllers/userController.js");


router.get("/profile/:cms",  userProfile);
router.get("/all",           getAllUsers);
router.put("/profile-image", updateProfileImage);

module.exports = router;
