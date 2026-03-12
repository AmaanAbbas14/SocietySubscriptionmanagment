const express = require("express");
const router = express.Router();

const notificationsController = require("../controllers/notificationsController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.use(authMiddleware);
router.use(roleMiddleware("ADMIN"));

router.post("/send-reminders", notificationsController.sendReminders);

module.exports = router;