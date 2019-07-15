const router = require('express').Router();
const fixtureController = require('../controllers/fixturesController');
const {auth, admin} = require('../middleware/auth');

const { storeValidator, updateValidator} = require('../middleware/validation/fixture');

router.use(auth);
router.get('/', fixtureController.index);
router.get('/completed', fixtureController.completed);
router.get('/pending', fixtureController.pending);
router.get('/:id', fixtureController.show);

//admin only routes
router.use(admin);
router.post('/', storeValidator, fixtureController.store);
router.put('/:id/generatelink', fixtureController.generateLink);
router.put('/:id', updateValidator, fixtureController.update);
router.delete('/:id', fixtureController.delete);

module.exports = router;