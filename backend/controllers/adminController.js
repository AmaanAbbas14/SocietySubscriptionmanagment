const { pool } = require("../config/db");

// Dashboard
const dashboardAnalytics = async (req,res)=>{

 const flats = await pool.query(
  "SELECT COUNT(*) FROM flats WHERE is_active=true"
 );

 const users = await pool.query(
  "SELECT COUNT(*) FROM users WHERE role='USER'"
 );

 const pending = await pool.query(
  "SELECT COALESCE(SUM(amount),0) FROM monthly_records WHERE status='PENDING'"
 );

 const collection = await pool.query(
  "SELECT COALESCE(SUM(amount),0) FROM payments"
 );

 res.json({
  total_flats: flats.rows[0].count,
  total_users: users.rows[0].count,
  pending_amount: pending.rows[0].coalesce,
  total_collection: collection.rows[0].coalesce
 });

};


const bcrypt = require("bcrypt");

const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, phone, role, created_at FROM users WHERE id=$1",
      [req.user.id] // Assumes authMiddleware sets req.user.id
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Admin profile not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    
    const result = await pool.query(
      `UPDATE users
       SET name=$1, phone=$2
       WHERE id=$3
       RETURNING id, name, email, phone, role, created_at`,
      [name, phone, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const result = await pool.query("SELECT password FROM users WHERE id=$1", [ req.user.id ]);
    const admin = result.rows[0];

    const valid = await bcrypt.compare(oldPassword, admin.password);
    if (!valid) {
      return res.status(401).json({ error: "Incorrect old password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    await pool.query("UPDATE users SET password=$1 WHERE id=$2", [hashedNewPassword, req.user.id]);

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { dashboardAnalytics, getProfile, updateProfile, changePassword };