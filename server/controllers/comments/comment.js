const asyncHandler = require("express-async-handler")
const Comment = require("../../model/Comment/Comment")
const Post = require("../../model/Post/Post")

//@desc  Create a comment
//@route GET /api/v1/comments/:postId
//@acess private
exports.createComment = asyncHandler(async(req,res)=>{
    //get the payload
    const {message,author} = req.body;
    //get postId from params
    const postId=req.params.postId;
    //create the comment
    const comment = await Comment.create({
        message,
        author : req.userAuth._id,
        postId,
    });
    //Associate comment to a post
    await Post.findByIdAndUpdate(postId,{
        $push:{comments:comment._id}
    },{new:true})
    //send the response
    res.json({
        status : "success",
        message:"Comment created successfully",
        comment,
    })


})

//@desc  Delete Comment
//@route DELETE /api/v1/comments/:id
//@acess Private
exports.deleteComment = asyncHandler(async(req,res)=>{
    await Comment.findByIdAndDelete(req.params.id);
    res.status(201).json({
        status:"success",
        message:"comment successfully deleted",  
    })
    
})


//@desc  update Comment
//@route PUT /api/v1/comments/:id
//@acess Private
exports.updateComment = asyncHandler(async(req,res)=>{
    const comment = await Comment.findByIdAndUpdate(req.params.id,
        {
            message:req.body.message,
        },
        {
            new : true,
            runValidators:true,
        }
    );
    res.status(201).json({
        status:"success",
        message:"Comment successfully updated",  
        comment,
    })
    
})
