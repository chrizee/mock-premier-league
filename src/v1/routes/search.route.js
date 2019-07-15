const router = require('express').Router();
const searchController = require('../controllers/searchController');

router.get('/', searchController.search);

module.exports = router;