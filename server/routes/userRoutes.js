const { Router } = require('express');
const { getUser } = require('../controllers/userController');

const router = Router();

router.get('/:userId', getUser);

module.exports = router;
