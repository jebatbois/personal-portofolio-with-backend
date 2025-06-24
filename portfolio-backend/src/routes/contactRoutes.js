// src/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware'); // Import middleware

// Rute ini tetap publik, siapa saja boleh mengirim pesan
router.post('/', contactController.createContactMessage);

// -- TAMBAHKAN RUTE DI BAWAH INI --
// Rute ini private, hanya admin yang boleh melihat dan menghapus pesan
router.get('/', protect, contactController.getAllMessages);
router.delete('/:id', protect, contactController.deleteMessage);

module.exports = router;