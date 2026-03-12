const { pool } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
  try {
    const { email } = req.body;
    
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    const user = result.rows[0];

    if (!user) {
      // Return 200 even if user not found to prevent email enumeration
      return res.status(200).json({ message: "If that email exists, a reset link has been sent." });
    }

    // Generate a 15-minute stateless reset token
    const resetToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET + user.password, // Attach current password to secret so token invalidates after use
      { expiresIn: "15m" }
    );

    // In a production environment, send this token via Email (Nodemailer) or SMS.
    // For now, we return it in the response so the frontend can route the user or the dev can copy it.
    res.json({ 
        message: "Password reset token generated successfully. In production, this would be emailed.", 
        resetToken 
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ error: "Invalid token or user" });
    }

    // Verify token using the user's specific secret (JWT_SECRET + current hash)
    try {
        jwt.verify(token, process.env.JWT_SECRET + user.password);
    } catch (tokenError) {
        return res.status(400).json({ error: "Token is invalid or has expired." });
    }

    // Token is valid. Hash the new password and update.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await pool.query("UPDATE users SET password=$1 WHERE id=$2", [hashedPassword, user.id]);

    res.json({ message: "Password has been successfully reset!" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    
    // Verify Google Token
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    // Get payload data
    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;
    const picture = payload.picture;

    // Check if user exists in Database
    let result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    let user = result.rows[0];

    // If user doesn't exist, auto register them as USER (Resident)
    if (!user) {
        const insertRes = await pool.query(
          `INSERT INTO users(name, email, role, password)
           VALUES($1, $2, 'USER', 'oauth_placeholder')
           RETURNING *`,
          [name, email]
        );
        user = insertRes.rows[0];
    }

    // Generate our JWT Token for session management
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });

  } catch (error) {
    res.status(401).json({ error: "Invalid Google Token or Verification Failed", details: error.message });
  }
};

module.exports = { login, forgotPassword, resetPassword, googleLogin };
