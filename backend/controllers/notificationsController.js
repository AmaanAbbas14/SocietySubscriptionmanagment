const { pool } = require("../config/db");

const sendReminders = async (req,res)=>{

 const result = await pool.query(`
  SELECT 
   users.id,
   flats.flat_number
  FROM monthly_records mr
  JOIN flats ON flats.id = mr.flat_id
  JOIN users ON users.id = flats.owner_id
  WHERE mr.status='PENDING'
 `);

 for(let record of result.rows){

  await pool.query(
   `INSERT INTO notifications(user_id,title,message)
    VALUES($1,$2,$3)`,
   [
    record.id,
    "Payment Reminder",
    "Your society payment is pending"
   ]
  );

 }

 res.json({message:"Reminders sent"});

};

module.exports = {sendReminders};