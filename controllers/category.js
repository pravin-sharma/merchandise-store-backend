const Category = require('../models/category');
const Product = require('../models/product');

exports.getCategoryById = (req,res,next,id) =>{
    Category.findById(id).exec()
    .then((category, err)=>{
        if(err || !category){
            return res.status(400).json({
                error: "Category Not found"
            })
        }
        req.category = category;
        next();
    })
}

exports.createCategory = (req,res,next) =>{
    const category = new Category(req.body);
    category.save()
    .then((data, err)=>{
        if(err){
            return res.status(402).json({
                err,
                error: "Failed to add category to db"
            })
        }

        return res.status(200).json({
            data,
            message: "Added category successfully"
        })
    })
}

exports.getCategory = (req,res,next) => {
    return res.status(200).json(req.category)
}

exports.getAllCategory = (req,res,next) => {
    Category.find().exec()
    .then((categories, err) => {
        if(err || !categories){
            return res.status(400).json({
                err,
                error: "No category found"
            })
        }
        return res.status(200).json({
            categories,
            message: "Category found"
        })
    })
}

exports.updateCategory = (req,res,next) =>{
    //categoryId 
    const category = req.category;
    category.name = req.body.name;

    category.save().then((category, err)=>{
        return res.status(200).json({
            category,
            message: "Updated Category successfully"
        })
    })
}

exports.removeCategory = (req,res) => {
    const category = req.category;
    category.remove((err, category)=>{
        if(err){
            return res.status(400).json({
                err,
                error: "Unable to delete category"
            })
        }
        return res.status(200).json({
            message: "Deleted Successfully",
            category
        })
    })
}