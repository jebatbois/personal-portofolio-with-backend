// src/routes/portfolioRoutes.js
const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');

// === RUTE UNTUK PROYEK PORTFOLIO UTAMA ===
// Rute Publik
router.get('/', portfolioController.getAllPortfolios);
router.get('/:id', portfolioController.getPortfolioById);

// Rute yang Diproteksi (Admin)
router.post('/', protect, portfolioController.createPortfolio);
router.put('/:id', protect, portfolioController.updatePortfolio);
router.delete('/:id', protect, portfolioController.deletePortfolio);


// === RUTE UNTUK GAMBAR GALERI DARI PROYEK TERTENTU ===
// Rute Publik untuk melihat galeri
router.get('/:id/images', portfolioController.getProjectImages);

router.post('/:id/images', protect, portfolioController.addProjectImage);

// Rute Private untuk menghapus gambar dari galeri
// Perhatikan URLnya berbeda agar tidak konflik: /images/:imageId
router.delete('/images/:imageId', protect, portfolioController.deleteProjectImage);


module.exports = router;