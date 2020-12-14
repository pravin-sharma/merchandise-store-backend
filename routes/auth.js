const express = require('express');
const {check} = require('express-validator');

const router = express.Router();

const authController = require('../controllers/auth');


router.post('/signup', [
    check('name').isLength({min: 3,max:32}).withMessage('Name should have minimum 3 characters'),
    check('email').isEmail().withMessage('Email should be in proper format'),
    check('password').isLength({min:3}).withMessage('Paswword should have minimum length of 3')
], authController.signup);

router.get('/signout', authController.signOut);

module.exports = router;