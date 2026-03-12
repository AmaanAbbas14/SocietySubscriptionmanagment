const razorpay = require("../config/razorpay");

const createOrder = async (req,res)=>{

 const {amount} = req.body;

 const order = await razorpay.orders.create({
  amount: amount * 100,
  currency:"INR"
 });

 res.json(order);

};
const verifyPayment = async (req,res)=>{

    const {payment_id,order_id} = req.body;
   
    await pool.query(`
     INSERT INTO payments(
      flat_id,
      monthly_record_id,
      amount,
      payment_mode,
      transaction_id
     )
     VALUES($1,$2,$3,'RAZORPAY',$4)
    `);
   
    res.json({status:"success"});
   
   };