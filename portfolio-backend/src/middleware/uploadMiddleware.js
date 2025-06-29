// src/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

// Ubah batas file sesuai kebutuhan (contoh: 5MB)
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 } // 5MB
});

module.exports = upload;