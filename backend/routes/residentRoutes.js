const express = require("express");
const router = express.Router();

const residentController = require("../controllers/residentController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// All resident routes securely locked behind USER role
router.use(authMiddleware);
router.use(roleMiddleware("USER"));

// Dashboard Overview
router.get("/dashboard", residentController.getDashboard);

// Subscriptions & Billing
router.get("/subscriptions", residentController.getSubscriptions);
router.get("/subscriptions/:id", residentController.getSubscriptionByMonth);

// Payments (Razorpay Flow)
router.post("/pay-now", residentController.createRazorpayOrder);
router.post("/verify-payment", residentController.verifyPayment);

// Profile
router.get("/profile", residentController.getProfile);
router.put("/profile", residentController.updateProfile);
router.put("/change-password", residentController.changePassword);

module.exports = router;
