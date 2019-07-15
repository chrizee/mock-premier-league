const { body, sanitizeBody} = require('express-validator');

exports.storeValidator = [
    body('homeTeamId').not().isEmpty().withMessage("home team id cannot be empty").isMongoId().withMessage("home team id must be a valid id"),
    body('awayTeamId').not().isEmpty().withMessage("away team id cannot be empty").isMongoId().withMessage("away team id must be a valid id").custom((val, {req}) => {
        if(val == req.body.homeTeamId) {
            throw new Error("home and away team Id cannot be the same");
        }
        return true;
    }),
    body("matchDate").not().isEmpty().withMessage("match date cannot be empty").isISO8601({strict: true}).withMessage("match date must be a valid date in yyyy-mm-dd hh:mm:ss format").isAfter().withMessage("Match date must be in the future"),

    sanitizeBody('*').escape().trim(),
    sanitizeBody('matchDate').toDate()
];

exports.updateValidator = [
    body('homeTeamScore').isInt({gt: -1}).withMessage("home team score must be a non negative integer ").optional().custom((val, {req}) => {
        if(val != null && req.body.awayTeamScore == null) {
            throw new Error("Away team score must be present with home team score");
        }
        return true;
    }),
    body('awayTeamScore').isInt({gt: -1}).withMessage("away team score must be a non negative integer").optional().custom((val, {req}) => {
        if(val != null && req.body.homeTeamScore == null) {
            throw new Error("Home team score must be present with away team score");
        }
        return true;
    }),
    body("matchDate").isISO8601({strict: true}).withMessage("match date must be a valid date in yyyy-mm-dd hh:mm:ss format").optional().custom((val, {req}) => {
        if(val && (req.body.homeTeamScore != null || req.body.awayTeamScore != null)) {
            throw new Error("Match date cannot be updated with scores present");
        }
        return true;
    }).isAfter().withMessage("Match date must be in the future"),

    sanitizeBody('*').escape().trim(),
    sanitizeBody('matchDate').toDate(),

];