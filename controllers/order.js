const { Order, ProductCart } = require('../models/orderAndProductCart');
const User = require('../models/user');

exports.getOrderById = (req, res, next, id) => {
    Order.findById(id)
        .populate('products.product', 'name price', Order)
        .exec()
        .then((order, err) => {
            if (err || !order) {
                return res.status(200).json({
                    error: "Unable to get order"
                })
            }

            req.order = order;
            next();
        })
}

exports.createOrder = (req, res) => {

    req.body.order.user = req.profile
    const order = new Order(req.body.order);
    order.save()
        .then((order, err) => {
            if (err || !order) {
                return res.status(400).json({
                    error: "Unable to create order"
                })
            } else {
                return res.status(200).json({
                    message: "Order Created",
                    order
                })
            }
        })
}

exports.getAllOrders = (req, res) => {
    Order.find()
        .populate('user', '_id name')
        .exec()
        .then((orders, err) => {
            if (err || !orders) {
                return res.status(400).json({
                    error: "Unable to get any order from DB"
                })
            }

            return res.status(200).json({
                message: "Orders fetched successfully",
                orders
            })
        })
}


//get types of order status available
exports.getOrderStatus = (req, res) => {
    return res.json(Order.schema.path('status').enumValues)
}


//update order status for an order
exports.updateOrderStatus = (req, res) => {
    Order.update(
        { _id: req.body.orderId },
        { $set: { status: req.body.status } },
        (err, updatedOrder) => {
            if (err || !updatedOrder) {
                return res.json(400).json({
                    error: "Failed to update order",
                    err
                })
            }

            return res.status(200).json({
                message: "Order updated successfully",
                updatedOrder
            })
        }
    )
}