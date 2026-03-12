const cron = require("node-cron");
const { pool } = require("../config/db");

cron.schedule("0 0 1 * *", async () => {

 console.log("Generating monthly subscription records...");

 const flats = await pool.query(`
  SELECT flats.id, flats.flat_type, subscription_plans.monthly_amount
  FROM flats
  JOIN subscription_plans
  ON flats.flat_type = subscription_plans.flat_type
  WHERE flats.is_active=true
 `);

 const month = new Date();
 month.setDate(1);

 for(let flat of flats.rows){

  await pool.query(`
   INSERT INTO monthly_records(flat_id,month,amount)
   VALUES($1,$2,$3)
   ON CONFLICT (flat_id,month) DO NOTHING
  `,[flat.id,month,flat.monthly_amount]);

 }

});