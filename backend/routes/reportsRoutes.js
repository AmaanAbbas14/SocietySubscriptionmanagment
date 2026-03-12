const express = require("express");
const router = express.Router();

const reportsController = require("../controllers/reportsController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.use(authMiddleware);
router.use(roleMiddleware("ADMIN"));

router.get("/dashboard", reportsController.adminDashboard);

module.exports = router;