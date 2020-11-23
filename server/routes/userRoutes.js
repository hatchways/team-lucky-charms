const { Router } = require('express');
const { getUser, updateUser } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const uploadImages = require('../controllers/imageUploadController');

const router = Router();

router.get('/:userId', getUser);
router.put('/:userId', auth, updateUser);
router.post('/:userId/imageUpload', auth, uploadImages);

module.exports = router;
