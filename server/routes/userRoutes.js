const { Router } = require('express');
const { getUser, updateUser } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

const router = Router();

router.get('/:userId', getUser);
router.put('/:userId', auth, updateUser);

module.exports = router;
