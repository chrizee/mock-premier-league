const router = require('express').Router();
const authController = require('../controllers/authController');

const {auth, admin} = require('../middleware/auth');
const {registerValidator, loginValidator} = require('../middleware/validation/auth');

router.post('/login', loginValidator, authController.login);
router.post('/register', registerValidator, authController.register);
router.post('/admin/register', registerValidator, authController.register);

module.exports = router;