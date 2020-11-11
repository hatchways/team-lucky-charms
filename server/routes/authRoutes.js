const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

router.post('/register', authController.registerPost);
router.post('/login', authController.loginPost);

module.exports = router;
