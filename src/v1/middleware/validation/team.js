const { body, sanitizeBody} = require('express-validator');

module.exports = [
    body('name').not().isEmpty().withMessage("Team name cannot be empty").isString().withMessage("Team name must be a string"),

    sanitizeBody('*').escape().trim(),
];
