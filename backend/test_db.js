require('dotenv').config();
const { pool } = require('./config/db');

async function testDB() {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log("DB Connection SUCCESS!", res.rows[0]);
    } catch (err) {
        console.error("DB Connection FAILED:", err);
    } finally {
        pool.end();
    }
}

testDB();
