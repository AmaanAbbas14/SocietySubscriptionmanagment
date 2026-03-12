const { pool } = require("../config/db");

const getMonthlyRecords = async (req,res)=>{

 const {month} = req.query;

 const result = await pool.query(`
  SELECT 
   mr.id,
   flats.flat_number,
   mr.amount,
   mr.status
  FROM monthly_records mr
  JOIN flats ON flats.id = mr.flat_id
  WHERE mr.month=$1
  ORDER BY flats.flat_number
 `,[month]);

 res.json(result.rows);

};

module.exports = {getMonthlyRecords};