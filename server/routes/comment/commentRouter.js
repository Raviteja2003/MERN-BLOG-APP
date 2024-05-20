const express = require('express');
const isLogin = require('../../middleware/isLogin');
const { createComment, updateComment, deleteComment, } = require('../../controllers/comments/comment');

const commentRouter = express.Router();

//create
commentRouter.post("/:postId",isLogin,createComment);

//update
commentRouter.put("/:id",isLogin,updateComment);

//delete
commentRouter.delete("/:id",isLogin,deleteComment);

//*Exports
module.exports = commentRouter;
