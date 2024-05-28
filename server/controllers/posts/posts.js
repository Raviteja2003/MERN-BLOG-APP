const asyncHandler = require("express-async-handler");
const User = require("../../model/User/User");
const Category = require("../../model/Category/Category");
const Post = require("../../model/Post/Post");
const expressAsyncHandler = require("express-async-handler");

//@desc create a post
//@route POST api/v1/posts
//@access Private
exports.createPost = asyncHandler(async(req,res)=>{
//GET the payload
const {title,content,categoryId} = req.body;
//check if post exists
const postFound = await Post.findOne({title});
if(postFound)
{
    throw new Error("Post already exists");
}
//create the post
const post = await Post.create({
    title,
    content,
    author:req?.userAuth?._id,
    category : categoryId,
    image:req?.file.path,
})
//associate post to the user
await User.findByIdAndUpdate(req?.userAuth?._id,{
    $push:{posts:post._id},
},
{
    new:true,
});

//push post into category
await Category.findByIdAndUpdate(req?.userAuth?._id,{
    $push:{posts:post._id},
},
{
    new:true,
});
//send the response
res.json({
    status:"Success",
    message:"post successfully created",
    post,
})

});


//@desc  Get all posts
//@route GET /api/v1/posts
//@acess private
exports.getPosts = asyncHandler(async(req,res)=>{
    //Find all users who have  blocked by the login user
    const loggedInUserId = req.userAuth?._id;
    //get current time
    const currentTime = new Date();
    const usersBlockingLoggedInuser = await User.find({
        blockedUsers:loggedInUserId,
    });
    //Extract the IDs of users who have been blocked by loggedIn user
    const blockedUsersIds = usersBlockingLoggedInuser?.map((user) => user?._id);

    //query
    const query = {
        author:{$nin:blockedUsersIds},
        $or:[
            {
                schedulePublished:{$lte: currentTime},
                schedulePublished:null,
            },
        ],
    };
    
    const posts = await Post.find(query).populate({
        path:"author",
        model:"User",
        select:"username email role",
    });
    
    res.status(201).json({
        status:"success",
        message:"posts successfully fetched",
        posts,
    })
    
})


//@desc  Get single post
//@route GET /api/v1/posts/:id
//@acess public
exports.getPost = asyncHandler(async(req,res)=>{
    
    const post = await Post.findById(req.params.id).populate("author")
    .populate("category")
    .populate({
      path: "comments",
      model: "Comment",
      populate: {
        path: "author",
        select: "username",
      },
    });
    if (!post) {
        return res.status(404).json({
            status: "failed",
            message: "Post not found",
        });
    }
    res.status(201).json({
        status:"success",
        message:"post successfully fetched",
        post,
    })
    
})

//@desc  Delete post
//@route DELETE /api/v1/post/:id
//@acess Private
exports.deletePost = asyncHandler(async(req,res)=>{
    await Post.findByIdAndDelete(req.params.id);
    res.status(201).json({
        status:"success",
        message:"Post successfully deleted",  
    })
    
})


//@desc  update post
//@route PUT /api/v1/post/:id
//@acess Private
exports.updatePost = asyncHandler(async(req,res)=>{
    const post = await Post.findByIdAndUpdate(req.params.id,
        req.body,
        {
            new : true,
            runValidators:true,
        }
    );
    res.status(201).json({
        status:"success",
        message:"post successfully updated",  
        post,
    })
    
})

//@desc  like a post
//@route PUT /api/v1/post/likes/:id
//@acess Private
exports.likePost = expressAsyncHandler(async(req,res)=>{
    //Get the id of post
    const {id} = req.params;
    //Get the login user
    const userId = req.userAuth._id;
    //Get the post
    const post = await Post.findById(id);
    if(!post)
    {
        throw new Error("Post not Found");
    }
    //push the user into post likes
    await Post.findByIdAndUpdate(id,
        {
            $addToSet:{likes:userId},
        },
        {
            new : true,
        }
    );
    //Remove the user from dislikes if already present
    post.dislikes = post.dislikes.filter((dislike)=>dislike.toString()!==userId.toString());

    //resave the post
    await post.save();
    res.status(200).json({
        message:"post liked successfully",
        post
    })
});


//@desc  dislike a post
//@route PUT /api/v1/post/dislikes/:id
//@acess Private
exports.disLikePost = expressAsyncHandler(async(req,res)=>{
    //Get the id of post
    const {id} = req.params;
    //Get the login user
    const userId = req.userAuth._id;
    //Get the post
    const post = await Post.findById(id);
    if(!post)
    {
        throw new Error("Post not Found");
    }
    //push the user into post dislikes
    await Post.findByIdAndUpdate(id,
        {
            $addToSet:{dislikes:userId},
        },
        {
            new : true,
        }
    );
    //Remove the user from likes if already present
    post.likes = post.likes.filter((like)=>like.toString()!==userId.toString());

    //resave the post
    await post.save();
    res.status(200).json({
        message:"post disliked successfully",
        post
    })
});

//@desc  clapping a post
//@route PUT /api/v1/post/claps/:id
//@acess Private
exports.claps = expressAsyncHandler(async(req,res)=>{
    //Get the id of post
    const {id} = req.params;
    //Get the post
    const post = await Post.findById(id);
    if(!post)
    {
        throw new Error("Post not Found");
    }
    //implement the claps to the post
    const updatedPost = await Post.findByIdAndUpdate(id,
        {
            $inc:{claps : 1},
        },
        {
            new : true,
        }
    )

    res.status(200).json({
        message : "post clapped successfully",
        updatedPost
    })

});

//@desc  scheduling a post
//@route PUT /api/v1/post/schedule/:postId
//@acess Private

exports.schedule = expressAsyncHandler(async(req,res)=>{
    //get the payload
    const {scheduledPublish} = req.body;
    const {postId} = req.params;
    //check if postId and scheduledPublish are found
    if(!postId || !scheduledPublish)
    {
        throw new Error("postId and schedule date are needed")
    }
    //Find the post
    const post = await Post.findById(postId);
    if(!post)
    {
        throw new Error("post not found");
    }
    //check  if user is author of the post
    if(post.author.toString()!==req.userAuth._id.toString())
    {
        throw new Error("you can schedule only ypur  post");
    }
    //check if publish date is in the past
    const scheduleDate = new Date(scheduledPublish);
    const currentDate = new Date();
    if(scheduleDate<currentDate)
    {
        throw new Error("schedule date cannot be in the past");
    }
    //update the post
    post.schedulePublished = scheduledPublish;
    await post.save();
    res.json({
        status:"success",
        message:"post scheduled successfully",
        post
    })
})

//@desc  Get only 4 posts
//@route GET /api/v1/posts
//@access PUBLIC

exports.getPublicPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .limit(4)
      .populate("category");
    res.status(201).json({
      status: "success",
      message: "Posts successfully fetched",
      posts,
    });
  });