// src/routes/resumeRoutes.js
const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

// Rute Publik
router.get('/', resumeController.getAllResumeItems);

// Rute yang Diproteksi (hanya admin)
router.post('/', protect, resumeController.createResumeItem);
// Anda bisa tambahkan rute PUT dan DELETE di sini nanti

module.exports = router;