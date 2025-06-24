// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const protect = (req, res, next) => {
  let token;
  // Cek apakah ada header 'Authorization' dan dimulai dengan 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Ambil token dari header (setelah 'Bearer ')
      token = req.headers.authorization.split(' ')[1];

      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');

      // Tempelkan info user ke object request (opsional tapi berguna)
      req.user = decoded;
      next(); // Lanjutkan ke controller jika token valid

    } catch (error) {
      res.status(401).json({ message: 'Token tidak valid, otorisasi gagal' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Tidak ada token, otorisasi gagal' });
  }
};

module.exports = { protect };