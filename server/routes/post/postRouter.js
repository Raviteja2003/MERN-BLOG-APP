const express = require('express');
const isLogin = require('../../middleware/isLogin');
const { createPost, getPosts, getPost, deletePost, updatePost, likePost, disLikePost, claps, schedule, getPublicPosts, postViewCount } = require('../../controllers/posts/posts');
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

//get only 4 posts
postRouter.get("/public", getPublicPosts);

//like post
postRouter.put("/likes/:id",isLogin,likePost);

//dislike post
postRouter.put("/dislikes/:id",isLogin,disLikePost);

//clap post
postRouter.put("/claps/:id",isLogin,claps);

//post views
postRouter.put("/:id/post-view-count",isLogin,postViewCount);

//schedule post
postRouter.put("/schedule/:postId",isLogin,schedule);

//single post
postRouter.get("/:id",getPost);

//update post
postRouter.put("/:id",isLogin,upload.single("file"),updatePost);

//delete post
postRouter.delete("/:id",isLogin,deletePost);




//*Exports
module.exports = postRouter;
