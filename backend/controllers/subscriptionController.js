const { pool } = require("../config/db");

const getPlans = async (req,res)=>{

 const result = await pool.query(
  "SELECT * FROM subscription_plans ORDER BY flat_type"
 );

 res.json(result.rows);

};

const updatePlan = async (req,res)=>{

 const {id} = req.params;
 const {monthly_amount} = req.body;

 const result = await pool.query(
  `UPDATE subscription_plans
   SET monthly_amount=$1
   WHERE id=$2
   RETURNING *`,
  [monthly_amount,id]
 );

 res.json(result.rows[0]);

};

module.exports = {getPlans,updatePlan};