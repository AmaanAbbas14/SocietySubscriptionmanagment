const express = require("express");
const router = express.Router();

const paymentsController = require("../controllers/paymentsController");

router.post("/",paymentsController.createPayment);

module.exports = router;