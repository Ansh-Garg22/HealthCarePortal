const express = require('express');
const router = express.Router();

const { registerPatient, login, getMe } = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerPatient);  // patient signup
router.post('/login', login);              // login patient/provider/admin

// Protected route
router.get('/me', authMiddleware, getMe);

module.exports = router;
