const express = require('express');

const router = express.Router();

const { getProductById, createProduct, getProduct, photo, removeProduct, 
        updateProduct, getAllProducts, getAllUniqueCategories } = require('../controllers/product');
const { getUserById } = require('../controllers/user');
const {isSignedIn, isAuthenticated, isAdmin} = require('../controllers/auth');


// Middleware for param
router.param('userId', getUserById);
router.param('productId', getProductById);

//get all products
router.get('/product/getAllProducts', getAllProducts);

//get unique categories
router.get('/product/categories', getAllUniqueCategories);

//get a product
router.get('/product/:productId', getProduct);

//get product photo
router.get('/product/photo/:productId', photo );

//create a product //admin
router.post('/product/create/:userId', isSignedIn, isAuthenticated, isAdmin, createProduct );

//update a product // admin
router.put('/product/:productId/:userId', isSignedIn, isAuthenticated, isAdmin, updateProduct );

//delete a product //admin
router.delete('/product/:productId/:userId', isSignedIn, isAuthenticated, isAdmin, removeProduct);




module.exports = router;