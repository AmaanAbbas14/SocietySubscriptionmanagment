const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Secure all admin routes
router.use(authMiddleware);
router.use(roleMiddleware("ADMIN"));

// Dashboard
router.get("/dashboard", adminController.dashboardAnalytics);

// Admin Profile
router.get("/profile", adminController.getProfile);
router.put("/profile", adminController.updateProfile);
router.put("/change-password", adminController.changePassword);

module.exports = router;