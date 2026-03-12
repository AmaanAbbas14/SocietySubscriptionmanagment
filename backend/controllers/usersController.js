const userModel = require("../models/usersModel");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  try {
    const { name, email, phone, password, role, device_token } = req.body;
    
    const existing = await userModel.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.createUser(name, email, phone, hashedPassword, role || "USER", device_token);
    
    // Remove password from response
    delete newUser.password;
    
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const user = await userModel.findUserByEmail(req.params.email);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    delete user.password;
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createUser, getUserByEmail };
