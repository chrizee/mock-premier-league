const { body, sanitizeBody} = require('express-validator');

exports.registerValidator = [
    body('name').not().isEmpty().withMessage("Name cannot be empty").isLength({min: 4}).withMessage("Name must be a minimum of 4 characters").trim(),
    body('email').isEmail().withMessage("email must be a valid email address").trim(),
    body('password').isLength({min: 6}).withMessage("Password must be aminimum of 6 characters").trim(),
    
    sanitizeBody('*').escape()
];

exports.loginValidator = [
    body('email').isEmail().withMessage("email must be a valid email address").trim(),
    body('password').not().isEmpty().withMessage("Password cannot be empty").trim(),    

    sanitizeBody('*').escape(),
];