const paymentsModel = require("../models/paymentsModel");

const createPayment = async (req,res)=>{
  try {
    const payment = await paymentsModel.createPayment(req.body);
    res.status(201).json(payment);
  } catch (error) {
    if (error.message === "Payment already exists") {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = {createPayment};