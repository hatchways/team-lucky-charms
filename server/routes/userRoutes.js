const { Router } = require('express');
const { getUser, updateUser } = require('../controllers/userController');
const {
  createConversation,
  getConversationsForUser,
} = require('../controllers/conversationController');
const auth = require('../middleware/authMiddleware');
const uploadImages = require('../controllers/imageUploadController');

const router = Router();

router.get('/:userId', getUser);
router.put('/:userId', auth, updateUser);
router.post('/:userId/imageUpload', auth, uploadImages);
router.get('/:userId/conversations', auth, getConversationsForUser); // get all conversations for a user
router.post('/:userId/conversations', auth, createConversation); // create a new conversation

module.exports = router;
