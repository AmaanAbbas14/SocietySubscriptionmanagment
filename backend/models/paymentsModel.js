const { pool } = require("../config/db");

const createPayment = async (data) => {

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    // check duplicate payment
    const existing = await client.query(
      `SELECT * FROM payments
       WHERE monthly_record_id=$1`,
      [data.monthly_record_id]
    );

    if (existing.rows.length > 0) {
      throw new Error("Payment already exists");
    }

    // insert payment
    const payment = await client.query(
      `INSERT INTO payments(
        flat_id,
        monthly_record_id,
        amount,
        payment_mode,
        transaction_id,
        receipt_url
      )
      VALUES($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [
        data.flat_id,
        data.monthly_record_id,
        data.amount,
        data.payment_mode,
        data.transaction_id,
        data.receipt_url
      ]
    );

    // update monthly record
    await client.query(
      `UPDATE monthly_records
       SET status='PAID'
       WHERE id=$1`,
      [data.monthly_record_id]
    );

    await client.query("COMMIT");

    return payment.rows[0];

  } catch (error) {

    await client.query("ROLLBACK");
    throw error;

  } finally {

    client.release();

  }

};

module.exports = { createPayment };