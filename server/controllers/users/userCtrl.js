const bcrypt = require("bcryptjs");
const User = require("../../model/User/User");
const generateToken = require("../../utils/generateToken");
const asyncHandler = require("express-async-handler");
const sendEmail = require("../../utils/sendEmail");
const expressAsyncHandler = require("express-async-handler");
const crypto = require('crypto');
const sendAccVerificationEmail = require("../../utils/sendAccVerificationEmail");

//@desc Register a new user
//@route POST api/v1/users/register
//@access public
exports.register = asyncHandler(async(req,res) =>{
    
    //get the details
    const  {username,password,email} = req.body;
    //check if user exists
    const user = await User.findOne({username});
    if(user)
    {
        throw new Error("user already exists");
    }
    //Register new User
    const newUser = new User({
            username,
            email,
            password,
            profilePicture:req?.file?.path,
    });
    //hashing password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password,salt);
    //save the user
    await newUser.save();
    res.status(201).json({
        status:"success",
        message:"User Registered Sucessfully",
        _id:newUser?._id,
        username:newUser?.username,
        email : newUser?.email,
        role: newUser?.role,
        newUser,
    });
    
});  

//@desc Login a new user
//@route POST api/v1/users/login
//@access public

exports.login  = asyncHandler( async(req,res)=>{
    
    //get the details
    const {username,password} = req.body;
    //check if user exists
    const user = await User.findOne({username});
    if(!user)
    {
        throw new Error("Invalid Login credentials");
    }
    //compare the hashed password with the one in request
    const isMathched = await bcrypt.compare(password,user?.password);
    if(!isMathched)
    {
        throw new Error("Invalid Login credentials");
    }
    //update the last login
    await user.save();
    user.lastLogin = new Date();
    res.json({
        status:"login sucsess",
        email:user?.email,
        _id:user?._id,
        username:user?.username,
        role:user?.role,
        token:generateToken(user),
    })
    
})

//@desc profile of a user
//@route POST api/v1/users/profile/:id
//@access private

exports.getProfile = asyncHandler(async(req,res) => {
    
    //get the id from params
    const id = req.userAuth._id;
    const user = await User.findById(id).populate({
        path:"posts",
        model:"Post",
    }).populate({
        path:"following",
        model:"User",
    }).populate({
        path:"followers",
        model:"User",
    }).populate({
        path:"blockedUsers",
        model:"User",
    }).populate({
        path:"profileViewrs",
        model:"User",
    })
    res.json({
        status:"success",
        message:"profile fetched",
        user,
    })

})


//@desc Block  user
//@route PUT api/v1/users/block/:userIdToBlock
//@access private
exports.blockUser = asyncHandler(async(req,res)=>{
    //Find the user to block
    const userIdToBlock = req.params.userIdToBlock;
    const userToBlock = await User.findById(userIdToBlock);
    if(!userToBlock)
    {
        throw new Error("User to Block has not found");
    }
    
    //Find user who is blocking
    const  userBlocking = req.userAuth._id

    //check if user is blocking him/herself
    if(userIdToBlock.toString()===userBlocking.toString())
    {
        throw new Error("Cannot block yourself");
    }
    
    //Find the current user
    const currentUser = await User.findById(userBlocking);

    //check if user has already blocked userToBlock
    if(currentUser?.blockedUsers?.includes(userIdToBlock))
    {
        throw new Error("User already blocked by you");
    }
    
    //push the userToBlock into the blockedUsers array of the currentUser
    currentUser?.blockedUsers.push(userIdToBlock);
    await currentUser.save();
    res.json({
        message:"user blocked successfully",
        status:"success",
    });
        
});


//@desc unBlock  user
//@route PUT api/v1/users/unblock/:userIdToUnBlock
//@access private

exports.unblockUser = asyncHandler(async(req,res)=>{
    //Find the user to unBlock
    const userIdToUnBlock = req.params.userIdToUnBlock;

    //Find the user to unblock
    const userToUnBlock = await User.findById(userIdToUnBlock);

    if(!userToUnBlock)
    {
        throw new Error("user to unblock not found");
    }

    //Find the current user
    const userUnBlocking = req.userAuth._id;
    const currentUser = await User.findById(userUnBlocking);

    //check if user to unblock  blocked by current user
    if(!currentUser?.blockedUsers.includes(userIdToUnBlock))
    {
        throw new Error("user to unblock is not blocked by you");
    }

    //remove the user from the blockedUsers array from the current array
    currentUser.blockedUsers = currentUser.blockedUsers.filter((id)=>id.toString()!==userIdToUnBlock.toString());

    //resave the user
    await currentUser.save();

    res.json({
        status:"success",
        message:"user unblocked sucessfully",
    })

    
});

//@desc who viewed my profile
//@route GET api/v1/users/profile-viewer/:userProfileId
//@access private
exports.profileViewers = asyncHandler(async(req,res)=>{
    //Find that we want to view his profile
    const userProfileId = req.params.userProfileId;
    const userProfile = await User.findById(userProfileId);
    if(!userProfile)
    {
        throw new Error("User to view his profile not found");
    }

    //Find the current user
    const currentUserId = req.userAuth._id;
    const currentUser = await User.findById(currentUserId);

    //check if user has already viewed the profile
    if(userProfile?.profileViewrs?.includes(currentUserId))
    {
        throw new Error("you have already viewed his profile");
    }
    
    //push the current user id into the user profile
    userProfile?.profileViewrs.push(currentUserId);
    await userProfile.save();
    res.json({
        message:"you have successfully viewed his/her profile",
        status:"success",
    });
        
});

//@desc user to follow
//@route PUT api/v1/users/following/:userToFollowId
//@access private
exports.followUser = asyncHandler(async(req,res)=>{
    //Find the current user
    const currentUserId = req.userAuth._id;

    //Find the user to follow
    const userToFollowId = req.params.userToFollowId;

    //Avoid user following himself
    if(currentUserId.toString()===userToFollowId.toString())
    {
        throw new Error("You cannot follow yourself");
    }

    //push the user to follow id into the current user following field
     await User.findByIdAndUpdate(currentUserId,{
        $addToSet:{following:userToFollowId},
    },
    {
        new:true,
    },
);

    //push the cuurent user id into the followers filed of user to follow id
     await User.findByIdAndUpdate(userToFollowId,{
        $addToSet:{followers:currentUserId},
    },
    {
        new:true,
    },
);
    //send the response
    res.json({
        status:"success",
        message:"you have followed user successfully",
    })
});

//@desc user to unfollow
//@route PUT api/v1/users/unfollowing/:userToUnFollowId
//@access private
exports.unFollowUser = asyncHandler(async(req,res)=>{
    //Find the current user
    const currentUserId = req.userAuth._id;

    //Find the user to follow
    const userToUnFollowId = req.params.userToUnFollowId;

    //Avoid user unfollowing himself
    if(currentUserId.toString()===userToUnFollowId.toString())
    {
        throw new Error("You cannot Unfollow yourself");
    }

    //Remove the user to unfollow id from the current user following field
     await User.findByIdAndUpdate(currentUserId,{
        $pull:{following:userToUnFollowId},
    },
    {
        new:true,
    },
);

    //Remove the cuurent user id from the followers filed of user to unfollow id
     await User.findByIdAndUpdate(userToUnFollowId,{
        $pull:{followers:currentUserId},
    },
    {
        new:true,
    },
);
    //send the response
    res.json({
        status:"success",
        message:"you have unfollowed user successfully",
    })
});

//@desc forgot password
//@route POST api/v1/users/forgot-password
//@access public
exports.fogotPassword = expressAsyncHandler(async(req,res)=>{
    const {email} = req.body;
    //Find the email in our database
    const userFound = await User.findOne({email});
    if(!userFound)
    {
        throw new Error("There is no user with this email in our system");
    }
    //create token
    const resetToken = await userFound.generatePasswordResetToken();

    //resave the user
    await userFound.save();

    //send the email
    sendEmail(email,resetToken);

    res.status(200).json({
        message:"email sent successfully",
        resetToken
    })

});

//@desc Reset password
//@route POST api/v1/users/reset-password/:resetToken
//@access public
exports.resetPassword = expressAsyncHandler(async(req,res)=>{
    //Get the id/token from the email/params
    const {resetToken} = req.params;
    const {password} = req.body;

    //convert the token into the actual token that has been saved into DB
    const cryptoToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    //Find the user by using crytoToken
    const userFound = await User.findOne({
        passwordResetToken:cryptoToken,
        passwordResetExpires:{$gt:Date.now()},
    })

    if(!userFound)
    {
        throw new Error("password Reset Token is invalid or expired");
    }

    //update the user password
    const salt =await bcrypt.genSalt(10);
    userFound.password = await bcrypt.hash(password,salt);
    userFound.passwordResetExpires = undefined;
    userFound.passwordResetToken = undefined;

    //resave the user
    await userFound.save();
    res.status(200).json({
        message:"password reset successfully completed",
    })
})

//@desc Account verification
//@route PUT api/v1/users/account-verification-email/
//@access private
exports.accountVerificationEmail = expressAsyncHandler(async(req,res)=>{
    //Find the login user
    const user  = await User.findById(req?.userAuth?._id);
    if(!user)
    {
        throw new Error("user not found");
    }
    //send the token
    const verifyToken = await  user.generateAccountVerificationToken();
    //resave the user
    await user.save();
    //send the email
    sendAccVerificationEmail(user?.email,verifyToken);
    res.status(200).json({
        message:`Account verification email send to ${user?.email}`,
        verifyToken
    });
});

//@desc verify token
//@route POST api/v1/users/account-verify/:verifyToken
//@access private
exports.verifyAccount = expressAsyncHandler(async(req,res)=>{
    //Get the id/token from the email/params
    const {verifyToken} = req.params;
    
    //convert the token into the actual token that has been saved into DB
    const cryptoToken = crypto.createHash('sha256').update(verifyToken).digest('hex');
    //Find the user by using crytoToken
    const userFound = await User.findOne({
        accountVerificationToken:cryptoToken,
        accountVerificationExpires:{$gt:Date.now()},
    })

    if(!userFound)
    {
        throw new Error("Account verification Token is invalid or expired");
    }

    //update the user account
    userFound.isVerified = true;
    userFound.accountVerificationToken = undefined;
    userFound.accountVerificationExpires = undefined;

    //resave the user
    await userFound.save();
    res.status(200).json({
        message:"Account verification successfully completed",
    })
})