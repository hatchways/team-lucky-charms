const { Router } = require('express');
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/authMiddleware');

const router = Router();
router.post('/fundproject', auth, paymentController.fundProject);
module.exports = router;
