// src/controllers/authController.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM admin_users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Username atau password salah.' });
    }

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Username atau password salah.' });
    }

    const payload = { id: admin.id, username: admin.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secretkey', { expiresIn: '8h' });

    res.json({ success: true, token: `Bearer ${token}` });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};