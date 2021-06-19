const express = require('express');
const router = express.Router();

const {getOrderById, createOrder, getAllOrders, getOrderStatus, updateOrderStatus} = require('../controllers/order');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getUserById, pushOrderInPurchaseList } = require('../controllers/user');
const { updateStockAndSold } = require('../controllers/product');

//middleware: params
router.param('userId', getUserById);
router.param('orderId', getOrderById);

//routes

//create order //User
router.post('/order/create/:userId', isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateStockAndSold, createOrder);

// get all order // isAdmin
router.get('/order/getAllOrders', isSignedIn, isAuthenticated, isAdmin, getAllOrders );

// get types of order status available //admin
router.get('/order/status/:userId', isSignedIn, isAuthenticated, isAdmin, getOrderStatus )

// update status of order by Admin
router.put('/order/:orderId/status/:userId', isSignedIn, isAuthenticated, isAdmin, updateOrderStatus)


module.exports = router;