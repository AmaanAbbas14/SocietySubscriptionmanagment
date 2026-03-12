const { pool } = require("../config/db");

const generateMonthlyRecords = async(month)=>{

 await pool.query(`
 INSERT INTO monthly_records(flat_id,month,amount)
 SELECT flats.id,$1,subscription_plans.monthly_amount
 FROM flats
 JOIN subscription_plans
 ON flats.flat_type = subscription_plans.flat_type
 `,[month]);

};

module.exports = generateMonthlyRecords;