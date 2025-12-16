const express = require("express");
const router = express.Router();

const { getAllUsers, updateProfileImage  } = require("../controllers/userController.js");


router.get("/all",           getAllUsers);
router.put("/profile-image", updateProfileImage);

module.exports = router;
