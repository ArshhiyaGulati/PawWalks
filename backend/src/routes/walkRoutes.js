const router = require('express').Router();
const walkController = require('../controllers/walkController');
const auth = require('../middleware/auth');

router.post('/book', auth('owner'), walkController.bookWalk);
router.get('/owner', auth('owner'), walkController.getOwnerWalks);
router.get('/owner/:id', auth('owner'), walkController.getOwnerWalks);
router.get('/walker', auth('walker'), walkController.getWalkerWalks);
router.get('/walker/:id', auth('walker'), walkController.getWalkerWalks);
router.post('/accept/:walkId', auth('walker'), walkController.acceptWalk);
router.post('/reject/:walkId', auth('walker'), walkController.rejectWalk);
router.post('/start/:walkId', auth('walker'), walkController.startWalk);
router.post('/end/:walkId', auth('walker'), walkController.endWalk);

module.exports = router;

