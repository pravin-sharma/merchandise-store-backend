
const express = require('express')
const router = express.Router();

const {getUserById , getUser, updateUser, userPurchaseList} = require('../controllers/user');
const {isAuthenticated, isSignedIn } = require('../controllers/auth');

//middleware for passing user object into req.
router.param('userId', getUserById);

//get user
router.get('/user/:userId', isSignedIn, isAuthenticated, getUser);

// update user
router.put('/user/:userId', isSignedIn, isAuthenticated, updateUser);

// get user purchase list
router.get('user/orders/:userId', isSignedIn, isAuthenticated, userPurchaseList)


module.exports = router;