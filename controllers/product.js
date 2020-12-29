const fs = require('fs');
const formidable = require('formidable');
const _ = require('lodash');


const Product = require('../models/product');
const Category = require('../models/category');

// middleware: get product by id in url and populate the req.
exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
        .populate('category', 'name', Category)
        .exec()
        .then((product, err) => {
            if (err || !product) {
                return res.status(400).json({
                    err,
                    error: "Product for given id not found"
                })
            }
            req.product = product;
            next()
        })
}

//middleware: update stock and sold data of a product
exports.updateStockAndSold = (req,res,next) => {

    let updateStockAndSoldOperation = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: {_id: prod._id},
                update: {$inc: {stock: -prod.count , sold: +prod.count}}
            }
        }
    })

    Product.bulkWrite(updateStockAndSoldOperation)
    .then((data, err)=>{
        if(err){
            return res.status(400).json({
                error: "Bulk Write operation for updating stocks and sold products failed",
                err
            })
        }

        res.json({
            message: "Bulk Write operation for updating stocks and sold products successful",
            data
        })

        next();
    })
}

// create a product
exports.createProduct = (req, res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true
    form.parse(req, (err, fields, file) => {

        if (err) {
            return res.status(400).json({
                err,
                error: "Error while creating a product"
            })
        }

        const {name, description, price, category} = fields;
        if( !name || !description || !price || !category){
            return res.status(400).json({
                error: "Field provided for adding new product is not valid"
            })
        }

        const product = new Product(fields);

        //handle file here
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File size should be less than 3MB"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }

        //save product to db
        product.save()
            .then((product, err) => {
                if (err) {
                    return res.status(400).json({
                        error: "Saving product in db failed"
                    })
                }

                return res.json({
                    message: "Product added to db",
                    product
                })
            })
    })
}

// get a product
exports.getProduct = (req,res) => {
    //get photo from seperate middleware call
    req.product.photo = undefined;

    return res.status(200).json(req.product) 
}

// get a product photo
exports.photo = (req,res,next) => {

    if(req.product.photo){
        res.set('Content-Type', req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
}

// remove/delete a product
exports.removeProduct = (req,res) => {
    const product = req.product;
    product.remove((err, product)=>{
        if(err){
            return res.status(400).json({
                err,
                error: "Failed removing the product from db"
            })
        }

        return res.status(200).json({
            message: "Product removed successfully",
            product
        })
    })
}

// update a product
exports.updateProduct = (req,res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true
    form.parse(req, (err, fields, file) => {

        if (err) {
            return res.status(400).json({
                err,
                error: "Error while creating a product"
            })
        }

        const {name, description, price, category} = fields;
        if( !name || !description || !price || !category){
            return res.status(400).json({
                error: "Field provided for adding new product is not valid"
            })
        }

        //updation code
        const product = req.product;
        product = _.extend(product, fields);

        //handle file here
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File size should be less than 3MB"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }

        //save product to db
        product.save()
            .then((updatedProduct, err) => {
                if (err) {
                    return res.status(400).json({
                        error: "Updating product in db failed"
                    })
                }

                return res.json({
                    message: "Product Updated in db",
                    updatedProduct
                })
            })
    })
}

// get all products with limit and sort
exports.getAllProducts = (req,res) => {
    let limit = req.query.limit ? parseInt( req.query.limit) : 8
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'

    Product.find()
    .select('-photo')
    .populate('category', 'name',Category)
    .sort([[sortBy, 'asc']])
    .limit(limit)
    .exec()
    .then((products, err)=>{
        if(err || !products){
            return res.status(400).json({
                error: "Unable to fetch products form DB",
                err
            })
        }

        return res.status(200).json({
            message: "Products fetched successfully",
            products
        })
    })
}

// get all distinct categories from Product
exports.getAllUniqueCategories = (req,res) => {
    Product.distinct('category',(err, category)=>{
        if(err){
            return res.status(400).json({
                error: "No unique category found",
                err
            })
        }

        return res.json(category);
    })
}




