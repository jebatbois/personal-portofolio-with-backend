// src/routes/userinfoRoutes.js
const express = require('express');
const router = express.Router();
const userinfoController = require('../controllers/userinfoController');

router.get('/', userinfoController.getUserInfo);

module.exports = router;