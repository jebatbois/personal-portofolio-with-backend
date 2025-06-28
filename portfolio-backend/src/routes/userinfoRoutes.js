// src/routes/userinfoRoutes.js
const express = require('express');
const router = express.Router();
const userinfoController = require('../controllers/userinfoController');
const { protect } = require('../middleware/authMiddleware');

// Rute ini publik, siapa saja boleh melihat info dasar
router.get('/', userinfoController.getUserInfo);

// Rute ini private, hanya admin yang sudah login yang boleh meng-update
// Ini adalah "jalan" yang kita butuhkan untuk menangani permintaan PUT dari frontend
router.put('/:id', protect, userinfoController.updateUserInfo);

module.exports = router;