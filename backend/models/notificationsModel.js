const { pool } = require("../config/db");

const createNotification = async(data)=>{

 const result = await pool.query(
  `INSERT INTO notifications(user_id,title,message)
   VALUES($1,$2,$3)
   RETURNING *`,
  [data.user_id,data.title,data.message]
 );

 return result.rows[0];
};

module.exports = { createNotification };