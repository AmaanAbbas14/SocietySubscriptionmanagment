const express = require("express");
const router = express.Router();

const subscriptionController = require("../controllers/subscriptionController");

router.get("/",subscriptionController.getPlans);
router.put("/:id",subscriptionController.updatePlan);

module.exports = router;