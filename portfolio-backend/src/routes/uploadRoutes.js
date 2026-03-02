// src/routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

// Definisikan rute untuk POST /api/upload
router.post('/', protect, (req, res, next) => {
  upload.single('image')(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: 'Ukuran file terlalu besar. Maksimal 5MB.' });
    } else if (err) {
      return res.status(500).json({ message: 'Upload gagal', error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Tidak ada file yang di-upload.' });
    }
    res.status(200).json({ filePath: req.file.path }); 
  });
});

module.exports = router;