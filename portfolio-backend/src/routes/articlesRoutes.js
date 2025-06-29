// src/routes/articlesRoutes.js
const express = require('express');
const router = express.Router();
const articlesController = require('../controllers/articlesController');
const { protect } = require('../middleware/authMiddleware');

// === RUTE PUBLIK ===
router.get('/', articlesController.getAllPublishedArticles);
router.get('/:slug', articlesController.getArticleBySlug);

// === RUTE PRIVATE (ADMIN) ===
router.get('/admin/all', protect, articlesController.getAllArticlesForAdmin);
router.get('/admin/:id', protect, articlesController.getArticleByIdForAdmin);
router.post('/', protect, articlesController.createArticle);
router.put('/:id', protect, articlesController.updateArticle);
router.delete('/:id', protect, articlesController.deleteArticle);

module.exports = router;