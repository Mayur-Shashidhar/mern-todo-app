const express = require('express');
const router = express.Router();
const { register, login, profile, changePassword, deleteAccount } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, profile);
router.post('/change-password', auth, changePassword);
router.post('/delete-account', auth, deleteAccount);

module.exports = router; 