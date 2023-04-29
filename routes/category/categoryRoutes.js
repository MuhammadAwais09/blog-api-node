const express = require('express');
const { createCategoryCtrl,
    singleCategoryCtrl,
    deleteCategoryCtrl,
    allCategoryCtrl,
    updateCategoryCtrl} = require("../../controllers/category/categoryctrl");
const categoryRouter = express.Router();
const islogin = require("../../middleware/isLogin")



//POST/api/v1/category
categoryRouter.post('/', islogin,createCategoryCtrl);

//GET/api/v1/category/
categoryRouter.get('/', allCategoryCtrl);


//GET/api/v1/category/:id
categoryRouter.get('/:id', singleCategoryCtrl);


//DELETE/api/v1/category/:id
categoryRouter.delete('/:id',islogin, deleteCategoryCtrl);

//PUT/api/v1/category/:id
categoryRouter.put('/:id', updateCategoryCtrl);


module.exports = categoryRouter;