const express = require('express');
// 
const authController = require('../controller/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// creating router for creating routes using express.Router()
const router = express.Router();

router.post('/register', authController.registerUser);

router.post('/login', authController.loginUser); 

// desc -> returns details of the user which send request on the API 
// also, if the user never registered or do not have token then the req will not be forwarded to the controller
router.get('/get-me', authMiddleware.authUser, authController.getMe);

router.get('/logout', authController.logout);




module.exports = router;