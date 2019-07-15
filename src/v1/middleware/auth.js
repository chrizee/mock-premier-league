require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
    const tokenHeader = req.header('Authorization');
    if(!tokenHeader) return res.status(401).json({success: false, message: "No token, authorization denied"});
    //check for token
    const token = tokenHeader.replace("Bearer ", '');    
    
    try {
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Add user from payload
        req.user = decoded;
        next();   
    } catch (error) {
        res.status(400).json({success: false, message: "Token is not valid"});
    }
}
exports.admin = (req, res, next) =>  {
    const user = req.user;
    if(user.is_admin) {
        return next();
    }
    res.status(401).json({success: false, message: "Only admins can carry out this operation"});
}