const User = require('../models/user');
const {validationResult} = require('express-validator')

exports.signup = (req, res, next) => {

    const errors = validationResult(req);
    console.log(errors)
    if(!errors.isEmpty()){
        return res.status(400).json({
            message: errors.errors[0].msg,
            param: errors.errors[0].param
        })
    }

    const user = new User(req.body);
    user.save()
    .then(user =>{
        res.status(200).json({
            name: user.name,
            email: user.email
        })
    })
    .catch(err=>res.status(400).send(err))
}

exports.signOut = (req, res, next) => {
    console.log("Signed out success");
    res.send("Signed out")
}
