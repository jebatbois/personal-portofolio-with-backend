// src/routes/userinfoRoutes.js
const express = require('express');
const router = express.Router();
const userinfoController = require('../controllers/userinfoController');
const { protect } = require('../middleware/authMiddleware');

// Rute publik (tidak berubah)
router.get('/', userinfoController.getUserInfo);

// --- TAMBAHKAN RUTE BARU INI ---
// Rute private untuk mengambil semua data mentah ke admin panel
router.get('/admin', protect, userinfoController.getUserInfoForAdmin);

// Rute untuk update (tidak berubah)
router.put('/:id', protect, userinfoController.updateUserInfo);

module.exports = router;