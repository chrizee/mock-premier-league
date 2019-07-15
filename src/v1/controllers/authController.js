const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/User');

const createUser = (req, res) => {
    const {name, email, password, is_admin} = req.body;

    const newUser = new User({
        name, email, password, is_admin
    });
    //create salt && hash
    return bcrypt.genSalt(10, (err, salt) => {
        return bcrypt.hash(newUser.password, salt, async (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            try {
                const user = await newUser.save();
                jwt.sign({ id: user._id, is_admin: user.is_admin }, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
                    if (err)
                        throw err;
                    return res.status(201).json({
                        success: true,
                        message: "Registration successful",
                        token,
                        user: {
                            name: user.name,
                            email: user.email,
                            id: user._id
                        }
                    });
                });
            }
            catch (err) {
                return res.status(500).json({ success: false, message: 'Something went wrong. Please try again' });
            }
        })
    })
}

exports.createUser = createUser;

exports.register = (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({success: false, message: "Validation failed", errors});
    }
    //for admin route (auth is already done to make sure only admins can get here)
    if(req.originalUrl.includes('admin')) {
        req.body.is_admin = true;
    }
    const email = req.body.email;
    return User.findOne({email})
        .then( async user => {
            if(user) {
                return res.status(400).json({success : false, "message": "User already exist"})
            } 
            
            return createUser(req, res);
        })
        .catch(() => res.status(500).json({success: false, message: "Something went wrong. Please try again"}))
}

exports.login = (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({success: false, message: "Validation failed", errors});
    }
    const {email, password } = req.body;

    //check for existing user
    User.findOne({email})
        .then(user => {
            if(!user) {
                return res.status(400).json({success : false, message: "User does not exists"})
            }

            //validate password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(!isMatch) return res.status(400).json({success: false, message: "Invalid credentials"});

                    jwt.sign(
                        {id: user._id, is_admin: user.is_admin},
                        process.env.JWT_SECRET,
                        {expiresIn: '24h'},
                        (err, token) => {
                            if(err) throw err;
                            res.status(200).json({
                                success: true,
                                message: "login successful",
                                token, 
                                user: {
                                    name: user.name,
                                    email: user.email,
                                    id: user._id
                                }
                            }); 
                        }
                    ); 
                })
                .catch(err => res.status(500).json({status: false, message: "Something went wrong. Please try again"}));          
        })
}