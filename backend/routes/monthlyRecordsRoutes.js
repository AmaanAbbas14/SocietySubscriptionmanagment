const express = require("express");
const router = express.Router();

const monthlyRecordsController = require("../controllers/monthlyRecordsController");

router.get("/", monthlyRecordsController.getMonthlyRecords);

module.exports = router;