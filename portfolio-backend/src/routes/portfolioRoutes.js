// src/routes/portfolioRoutes.js
const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware'); // Import middleware penjaga

// Rute Publik
router.get('/', portfolioController.getAllPortfolios);

// Rute yang Diproteksi (hanya admin)
router.post('/', protect, portfolioController.createPortfolio);
router.put('/:id', protect, portfolioController.updatePortfolio);
router.delete('/:id', protect, portfolioController.deletePortfolio);

module.exports = router;