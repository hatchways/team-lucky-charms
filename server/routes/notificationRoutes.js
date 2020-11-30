const { Router } = require('express');
const {
  getUserNotifications,
} = require('../controllers/notificationsController');
const auth = require('../middleware/authMiddleware');

const router = Router();

router.get('/:userId', auth, getUserNotifications);

module.exports = router;
