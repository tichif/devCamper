const express = require('express');

const { registerUser, login, getMe } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(login);
router.get('/me', protect, getMe);

module.exports = router;
