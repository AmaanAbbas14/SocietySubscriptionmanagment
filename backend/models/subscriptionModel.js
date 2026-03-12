const { pool } = require("../config/db");

const getPlans = async()=>{

 const result = await pool.query(
  `SELECT * FROM subscription_plans`
 );

 return result.rows;
};

const updatePlan = async(id,amount)=>{

 const result = await pool.query(
  `UPDATE subscription_plans
   SET monthly_amount=$1
   WHERE id=$2
   RETURNING *`,
   [amount,id]
 );

 return result.rows[0];
};

module.exports = { getPlans, updatePlan };