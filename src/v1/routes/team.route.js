const router = require('express').Router();

const teamController = require('../controllers/teamController');
const {auth, admin} = require('../middleware/auth');
const teamValidator = require('../middleware/validation/team');


router.use(auth);
router.get('/', teamController.index);

//admin routes
router.use(admin);
router.delete('/:id', teamController.delete);

router.put('/:id', teamValidator, teamController.update);
router.post('/', teamValidator, teamController.store);

module.exports = router;