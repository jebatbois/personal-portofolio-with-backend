// src/routes/resumeRoutes.js
const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

// Rute publik untuk menampilkan data di halaman utama
// GET /api/resume
router.get('/', resumeController.getAllResumeItems);
router.get('/:id', resumeController.getResumeItemById); // <-- TAMBAHKAN INI

// Rute private untuk admin
// POST /api/resume
router.post('/', protect, resumeController.createResumeItem);

// PUT /api/resume/:id
router.put('/:id', protect, resumeController.updateResumeItem);

// DELETE /api/resume/:id
router.delete('/:id', protect, resumeController.deleteResumeItem);

// Rute untuk mengelola gambar galeri resume
router.get('/:id/images', resumeController.getResumeImages);
router.post('/:id/images', protect, resumeController.addResumeImage);
router.delete('/images/:imageId', protect, resumeController.deleteResumeImage);


module.exports = router;