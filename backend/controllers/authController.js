const { pool } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid email" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const forgotPassword = async (req, res) => {
  res.status(501).json({ message: "Forgot Password not yet implemented" });
};

const resetPassword = async (req, res) => {
  res.status(501).json({ message: "Reset Password not yet implemented" });
};

module.exports = { login, forgotPassword, resetPassword };
