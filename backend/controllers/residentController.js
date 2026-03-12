const { pool } = require("../config/db");
const bcrypt = require("bcrypt");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const paymentsModel = require("../models/paymentsModel");

// 1. Dashboard Summary
const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's active flats
    const flatsRes = await pool.query(
      "SELECT id, flat_number, flat_type FROM flats WHERE owner_id=$1 AND is_active=true",
      [userId]
    );
    const flats = flatsRes.rows;

    if (flats.length === 0) {
      return res.json({ flats: [], pendingAmount: 0, recentPayments: [], notifications: [] });
    }

    const flatIds = flats.map(f => f.id);

    // Get Total Pending Amount across all flats
    const pendingRes = await pool.query(
      "SELECT COALESCE(SUM(amount),0) as total FROM monthly_records WHERE flat_id = ANY($1) AND status='PENDING'",
      [flatIds]
    );

    // Get 3 recent payments
    const paymentsRes = await pool.query(
      `SELECT p.id, p.amount, p.payment_mode, p.payment_date, f.flat_number 
       FROM payments p 
       JOIN flats f ON p.flat_id = f.id 
       WHERE p.flat_id = ANY($1) 
       ORDER BY p.payment_date DESC LIMIT 3`,
      [flatIds]
    );

    // Get unread notifications
    const notificationsRes = await pool.query(
      "SELECT id, title, message, created_at FROM notifications WHERE user_id=$1 AND is_read=false ORDER BY created_at DESC LIMIT 5",
      [userId]
    );

    res.json({
      flats,
      pendingAmount: pendingRes.rows[0].total,
      recentPayments: paymentsRes.rows,
      notifications: notificationsRes.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Full Subscription Billing History
const getSubscriptions = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all monthly records and left join with payments for the user's flats
    const result = await pool.query(`
      SELECT mr.id as bill_id, mr.month, mr.amount, mr.status, 
             f.flat_number, f.flat_type,
             p.payment_mode, p.payment_date, p.receipt_url
      FROM monthly_records mr
      JOIN flats f ON mr.flat_id = f.id
      LEFT JOIN payments p ON p.monthly_record_id = mr.id
      WHERE f.owner_id = $1 AND f.is_active = true
      ORDER BY mr.month DESC
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Detailed Subscription (1 month)
const getSubscriptionByMonth = async (req, res) => {
  try {
    const userId = req.user.id;
    const billId = req.params.id;

    const result = await pool.query(`
      SELECT mr.id as bill_id, mr.month, mr.amount, mr.status, mr.created_at as bill_generated_date,
             f.flat_number, f.flat_type,
             p.transaction_id, p.payment_mode, p.payment_date, p.receipt_url
      FROM monthly_records mr
      JOIN flats f ON mr.flat_id = f.id
      LEFT JOIN payments p ON p.monthly_record_id = mr.id
      WHERE f.owner_id = $1 AND mr.id = $2
    `, [userId, billId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Bill not found or access denied" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Initiate Razorpay Online Payment
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, bill_id } = req.body; // Amount should be in rupees

    if (!amount || !bill_id) {
       return res.status(400).json({ error: "Amount and bill_id are required" });
    }

    // Verify bill actually belongs to the resident and is pending
    const billCheck = await pool.query(
      `SELECT mr.id FROM monthly_records mr 
       JOIN flats f ON mr.flat_id = f.id 
       WHERE mr.id = $1 AND f.owner_id = $2 AND mr.status = 'PENDING'`,
      [bill_id, req.user.id]
    );

    if (billCheck.rows.length === 0) {
       return res.status(403).json({ error: "Invalid bill or already paid" });
    }

    const options = {
      amount: amount * 100, // Razorpay takes amount in paise
      currency: "INR",
      receipt: `receipt_order_${bill_id}_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Verify Razorpay Payment Signature
const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      flat_id,
      monthly_record_id,
      amount
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      
      // Payment matches signature! Persist to DB
      const paymentData = {
        flat_id,
        monthly_record_id,
        amount,
        payment_mode: "ONLINE",
        transaction_id: razorpay_payment_id,
        receipt_url: `https://dashboard.razorpay.com/app/payments/${razorpay_payment_id}`
      };

      const payment = await paymentsModel.createPayment(paymentData);
      return res.status(200).json({ message: "Payment verified successfully", payment });
      
    } else {
      return res.status(400).json({ error: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 6. Get Resident Profile
const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, phone, role, created_at FROM users WHERE id=$1",
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 7. Update Profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    
    const result = await pool.query(
      `UPDATE users SET name=$1, phone=$2 WHERE id=$3
       RETURNING id, name, email, phone, role, created_at`,
      [name, phone, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 8. Change Password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const result = await pool.query("SELECT password FROM users WHERE id=$1", [ req.user.id ]);
    const user = result.rows[0];

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Incorrect current password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    await pool.query("UPDATE users SET password=$1 WHERE id=$2", [hashedNewPassword, req.user.id]);
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDashboard,
  getSubscriptions,
  getSubscriptionByMonth,
  createRazorpayOrder,
  verifyPayment,
  getProfile,
  updateProfile,
  changePassword
};
