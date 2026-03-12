const express = require("express");
const router = express.Router();

const { login, forgotPassword, resetPassword, googleLogin } = require("../controllers/authController");

router.post("/login", login);
router.post("/google", googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;