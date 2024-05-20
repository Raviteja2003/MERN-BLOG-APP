const express = require('express');
const isLogin = require('../../middleware/isLogin');
const { createPost, getPosts, getPost, deletePost, updatePost, likePost, disLikePost, claps, schedule } = require('../../controllers/posts/posts');
const checkAccountVerification = require('../../middleware/isAccountVerified');
const storage = require('../../utils/fileUpload');
const multer = require("multer");

const postRouter = express.Router();

//!file upload middleware
const upload = multer({storage});

//create
postRouter.post("/",isLogin,upload.single("file"),createPost);

//getting all posts
postRouter.get("/",isLogin,getPosts);

//single post
postRouter.get("/",getPost);

//delete post
postRouter.delete("/:id",isLogin,deletePost);

//update post
postRouter.put("/:id",isLogin,updatePost);

//like post
postRouter.put("/likes/:id",isLogin,likePost);

//dislike post
postRouter.put("/dislikes/:id",isLogin,disLikePost);

//clap post
postRouter.put("/claps/:id",isLogin,claps);

//schedule post
postRouter.put("/schedule/:postId",isLogin,schedule);

//*Exports
module.exports = postRouter;
