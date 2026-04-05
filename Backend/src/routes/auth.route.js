const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// creating api fore registering user
router.post('/register', authController.register);
// creating api fore registering user
router.post('/login', authController.login);

router.get('/get-me', authController.getMe);

router.get('/logout', authController.logout);




module.exports = router;