// src/routes/skillsRoutes.js
const express = require('express');
const router = express.Router();
const skillsController = require('../controllers/skillsController');
const { protect } = require('../middleware/authMiddleware');

// Rute GET ini kita biarkan publik, tidak perlu "protect"
router.get('/', skillsController.getAllSkills);

// Hanya rute yang mengubah data yang kita proteksi
router.post('/', protect, skillsController.createSkill);
router.put('/:id', protect, skillsController.updateSkill);
router.delete('/:id', protect, skillsController.deleteSkill);

module.exports = router;