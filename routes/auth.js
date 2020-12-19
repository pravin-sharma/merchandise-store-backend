const express = require('express');
const {check} = require('express-validator');

const router = express.Router();

const authController = require('../controllers/auth');


router.post('/signup', [
    check('name').isLength({min: 3,max:32}).withMessage('Name should have minimum 3 characters'),
    check('email').isEmail().withMessage('Email should be in proper format'),
    check('password').isLength({min:3}).withMessage('Paswword should have minimum length of 3')
], authController.signup);

router.post('/signin', [
    check('email').isEmail().withMessage('Email should be in proper format'),
    check('password').isLength({min:1}).withMessage('Paswword is required')
], authController.signin);

router.get('/signout', authController.signOut);

// protected routes

router.get('/testprotectedroute', authController.isSignedIn , (req,res,next)=>{
    res.json({
        message: "Is Signed In"
    })
})



module.exports = router;