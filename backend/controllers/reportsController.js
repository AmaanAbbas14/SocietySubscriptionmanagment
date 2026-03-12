const { pool } = require("../config/db");

const monthlyReport = async (req,res)=>{

 const result = await pool.query(`
  SELECT 
   DATE_TRUNC('month',payment_date) AS month,
   SUM(amount) AS total
  FROM payments
  GROUP BY month
  ORDER BY month
 `);

 res.json(result.rows);

};

const paymentModes = async (req,res)=>{

 const result = await pool.query(`
  SELECT payment_mode,SUM(amount)
  FROM payments
  GROUP BY payment_mode
 `);

 res.json(result.rows);

};

module.exports = {
 monthlyReport,
 paymentModes,
 adminDashboard: monthlyReport // Assuming adminDashboard combines or returns monthly report for now
};