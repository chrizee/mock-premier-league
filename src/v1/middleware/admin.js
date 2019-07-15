const config = require('dotenv').config();
const jwt = require('jsonwebtoken');

function admin(req, res, next) {
    const user = req.user;
    if(user.is_admin) {
        return next();
    }
    res.status(401).json({success: false, message: "Only admins can carry out this operation"});
}

module.exports = admin;