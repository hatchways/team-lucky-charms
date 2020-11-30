const { Router } = require('express');
const { getUserNotifications, postUserNotifications } = require('../controllers/notificationsController');
const auth = require('../middleware/authMiddleware');

const router = Router();

router.get('/:userId', auth, getUserNotifications);
router.post('/:userId', postUserNotifications);

module.exports = router;
