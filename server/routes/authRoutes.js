const { Router } = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

const router = Router();

router.post('/register', authController.registerPost);
router.post('/login', authController.loginPost);
router.get('/getuser', auth, authController.getUser);
router.post("/logout", authController.logoutUser);

module.exports = router;
