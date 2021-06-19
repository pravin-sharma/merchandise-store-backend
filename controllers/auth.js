require('dotenv').config({path:'../.env'})
const User = require('../models/user');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.signup = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.errors[0].msg,
            param: errors.errors[0].param
        })
    }

    const {name,lastname,email,password} = req.body;

    const user = new User({
        name,
        lastname,
        email,
        password
    });

    user.save()
        .then(user => {
            res.status(200).json({
                name: user.name,
                email: user.email
            })
        })
        .catch(err => {
            console.log(err.code);
            if (err.code == '11000') {
                return res.status(400).json({
                    error: "Account with this email already exist"
                })
            }

            return res.status(400).json({
                error: err.message
            })
        })
}

exports.signin = (req, res, next) => {
    //backend field validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.errors[0].msg,
            param: errors.errors[0].param
        })
    }

    const { email, password } = req.body;

    //find user by email - check if email is registered - if email id exists -> Authenticate - if Authentication Succesful -> return JWT 
    User.findOne({ email: email }, (err, user) => {
        //if no email found or err in query or connection
        if (err) {
            return res.status(400).json({
                error: err
            })
        }

        if (!user) {
            return res.status(400).json({
                error: "User not Found"
            })
        }

        //if email found, match the password - logic for authentication is written in model
        if (user.authenticate(password)) {
            console.log('User Athenticated')
            const { _id, name, lastname, email, role, purchases } = user

            //Creating token
            const token = jwt.sign({ '_id': _id }, process.env.SECRET);
            
            res.cookie('token', token, { expire: new Date() + 9999 });
            
            //send response to front end
            return res.json({
                token: token,
                user: {
                    _id: _id,
                    name: name,
                    lastname: lastname,
                    email: email,
                    role: role,
                    purchases: purchases
                }
            })
        } else {
            return res.status(401).json({
                error: "User Email or password incorrect"
            })
        }
    })
}

exports.signOut = (req, res, next) => {
    res.clearCookie('token');
    return res.status(200).json({
        message: "Signed out successfully"
    })
}

exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    algorithms: ['HS256'],
    userProperty: "auth"
})

// custom middleware
//isAuthenticated
exports.isAuthenticated = (req, res, next) => {
    const checker = req.profile && req.auth && req.profile._id == req.auth._id
    if (!checker) {
        return res.status(403).json({
            error: "ACCESS DENIED"
        })
    }
    next();
}

//isAdmin
exports.isAdmin = (req, res, next) => {
    if (req.profile.role == 0) {
        return res.status(403).json({
            error: "You are not ADMIN, ACCESS DENIED"
        })
    }
    next();
}
