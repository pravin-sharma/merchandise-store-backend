const mongoose = require('mongoose');

const {ObjectId} = mongoose.Schema;

const productCartSchema = new mongoose.Schema({
    product:{
        type: ObjectId,
        ref: "Product"
    },
    name: String,
    count: Number,
    price: Number
},{timestamps: true});

const orderSchema = new mongoose.Schema({
    products: [productCartSchema],
    transaction_id: {},
    amount: {
        type: Number
    },
    address:{
        type: String
    },
    status:{
        type: String,
        default: "Received",
        enum: ['Delivered','Out for Delivery', 'Shipped', 'Processing', 'Received']
    },
    updated:{
        type: Date
    },
    user:{
        type: ObjectId,
        ref: "User"
    }
},{timestamps: true});

const Order = mongoose.model('Order', orderSchema);
const ProductCart = mongoose.model('ProductCart', productCartSchema);

module.exports = {Order, ProductCart};