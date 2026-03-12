const { pool } = require("../config/db");

const getRecords = async(month)=>{

 const result = await pool.query(
  `SELECT * FROM monthly_records
   WHERE month=$1`,
   [month]
 );

 return result.rows;
};

module.exports = { getRecords };