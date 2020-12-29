const express = require('express');

const router = express.Router();

const { getCategoryById, createCategory, getCategory, getAllCategory, updateCategory, removeCategory } = require('../controllers/category');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');

//Middleware for param
router.param('userId', getUserById);
router.param('categoryId', getCategoryById);

// get all categories
router.get('/category/allCategory', getAllCategory);

//get category by id
router.get('/category/:categoryId', getCategory);

//creating category //admin only
router.post('/category/create/:userId', 
    isSignedIn, 
    isAuthenticated, 
    isAdmin, 
    createCategory);

//update category //admin only
router.put('/category/:categoryId/:userId', 
    isSignedIn, 
    isAuthenticated, 
    isAdmin, 
    updateCategory);

//delete category //admin only
router.delete('/category/:categoryId/:userId',
    isSignedIn,
    isAuthenticated,
    isAdmin,
    removeCategory);

module.exports = router;