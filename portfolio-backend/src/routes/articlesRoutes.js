// src/routes/articlesRoutes.js
const express = require('express');
const router = express.Router();
const articlesController = require('../controllers/articlesController');
const { protect } = require('../middleware/authMiddleware');

// Rute Publik
router.get('/', articlesController.getAllPublishedArticles);
router.get('/:slug', articlesController.getArticleBySlug);

// Rute Private (Admin)
router.get('/admin/all', protect, articlesController.getAllArticlesForAdmin);
router.post('/', protect, articlesController.createArticle);
router.put('/:id', protect, articlesController.updateArticle);
router.delete('/:id', protect, articlesController.deleteArticle);


module.exports = router;