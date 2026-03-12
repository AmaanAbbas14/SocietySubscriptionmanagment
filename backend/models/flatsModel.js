const { pool } = require("../config/db");

const getFlats = async ({ search, page, limit, sort }) => {

 const offset = (page - 1) * limit;

 let query = `
  SELECT 
    flats.id,
    flats.flat_number,
    flats.flat_type,
    flats.is_active,
    users.name,
    users.email,
    users.phone
  FROM flats
  LEFT JOIN users
  ON flats.owner_id = users.id
  WHERE flats.is_active = true
 `;

 const values = [];

 if (search) {
  values.push(`%${search}%`);
  query += ` AND flats.flat_number ILIKE $${values.length}`;
 }

 if (sort) {
  query += ` ORDER BY ${sort}`;
 } else {
  query += ` ORDER BY flats.id`;
 }

 values.push(limit);
 values.push(offset);

 query += ` LIMIT $${values.length-1} OFFSET $${values.length}`;

 const result = await pool.query(query, values);

 return result.rows;
};


const createFlat = async (data) => {

 const result = await pool.query(
  `INSERT INTO flats(flat_number,flat_type,owner_id)
   VALUES($1,$2,$3)
   RETURNING *`,
  [data.flat_number,data.flat_type,data.owner_id]
 );

 return result.rows[0];
};


const updateFlat = async (id,data) => {

 const result = await pool.query(
  `UPDATE flats
   SET flat_number=$1,
       flat_type=$2,
       owner_id=$3
   WHERE id=$4
   RETURNING *`,
  [data.flat_number,data.flat_type,data.owner_id,id]
 );

 return result.rows[0];
};


const deleteFlat = async (id) => {

 const result = await pool.query(
  `UPDATE flats
   SET is_active=false
   WHERE id=$1
   RETURNING *`,
  [id]
 );

 return result.rows[0];
};


module.exports = {
 getFlats,
 createFlat,
 updateFlat,
 deleteFlat
};