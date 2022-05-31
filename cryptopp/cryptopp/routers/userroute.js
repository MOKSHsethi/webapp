const express = require('express');
const router = express.Router();
const { resetPassword, forgotPassword, login, registerUser } = require('../controllers/usercontroller')

router.post('/signup', registerUser);
router.post('/login', login);
router.post('/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);


module.exports = router;