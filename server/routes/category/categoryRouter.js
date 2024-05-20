const express = require('express');
const isLogin = require('../../middleware/isLogin');
const { createCategory,getCategories,updateCategory,deleteCategory } = require('../../controllers/category/Category');

const categoryRouter = express.Router();

//create
categoryRouter.post("/",isLogin,createCategory)

//all categories
categoryRouter.get("/",getCategories);

//delete category
categoryRouter.delete("/:id",isLogin,deleteCategory);

//update category
categoryRouter.put("/:id",isLogin,updateCategory);

//*Exports
module.exports = categoryRouter;
