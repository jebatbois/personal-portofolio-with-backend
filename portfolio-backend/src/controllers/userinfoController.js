// src/controllers/userinfoController.js
const db = require('../config/db');

exports.getUserInfo = async (req, res) => {
  try {
    // Kita asumsikan hanya ada 1 baris data di tabel userinfo
    const [rows] = await db.query('SELECT * FROM userinfo LIMIT 1');
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User info tidak ditemukan.' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};