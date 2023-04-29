const Category = require("../../model/Category/Category");
const {appErr} = require("../../utils/appErr")
// create category 
const createCategoryCtrl = async(req,res,next)=>{
    const {title} = req.body;
    try {
        const category = await Category.create({title, user: req.userAuth});
        res.json({
            status: "success",
            data: category,
        })
    } catch (error) {
       return  next(appErr(error.message))
    }
}

//all category 
const allCategoryCtrl =  async(req,res,next)=>{
    try {
        const category = await Category.find()
        res.json({
            status: "success",
            data: category,
        })
    } catch (error) {
        res.json(error.message);
    }
}


//single category 
const singleCategoryCtrl =  async(req,res)=>{
    try {
        const categories = await Category.findById(req.params.id)
        res.json({
            status: "success",
            data: categories,
        })
    } catch (error) {
        return next(appErr(error.message) )
    }
}

//Delete category
const deleteCategoryCtrl = async(req,res,next)=>{
    try {
     await Category.findByIdAndDelete(req.params.id)
        res.json({
            status: "success",
            data: "Successfully Deleted Category"
        })
    } catch (error) {
       next(appErr(error.message))
    }
}

//Update category 

const updateCategoryCtrl = async(req,res,next)=>{
    const {title} = req.body;
    try {
        const category = await Category.findByIdAndUpdate(req.params.id,{title}, {new: true, runValidators: true})
        res.json({
            status: "success",
            data: category,
        })
    } catch (error) {
        res.json(error.message);
    }
}
module.exports = {
    createCategoryCtrl,
    singleCategoryCtrl,
    deleteCategoryCtrl,
    updateCategoryCtrl,
    allCategoryCtrl
}