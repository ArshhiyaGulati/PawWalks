const router = require('express').Router();
const dogController = require('../controllers/dogController');
const auth = require('../middleware/auth');

router.post('/', auth('owner'), dogController.createDog);
router.get('/', auth(), dogController.getDogsByOwner);
router.get('/owner/:ownerId', auth(), dogController.getDogsByOwner);

module.exports = router;

