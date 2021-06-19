const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated } = require("../controllers/auth");

const { getToken, processPayment } = require("../controllers/paymentb");
const { getUserById } = require("../controllers/user");

// Load User in req
router.param('userId', getUserById);

// Get Token
router.get("/payment/gettoken/:userId", isSignedIn, isAuthenticated, getToken);

// Process Payment
router.post(
  "/payment/braintree/:userId",
  isSignedIn,
  isAuthenticated,
  processPayment
);

module.exports = router;
