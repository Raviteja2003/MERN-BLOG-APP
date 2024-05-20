const express = require('express');
const { register, login, getProfile, blockUser, unblockUser, profileViewers, followUser, unFollowUser, fogotPassword, resetPassword, accountVerificationEmail, verifyAccount } = require('../../controllers/users/userCtrl');
const isLogin = require('../../middleware/isLogin');
const storage = require('../../utils/fileUpload');
const multer = require("multer");

const userRoutes = express.Router();

//!file upload middleware
const upload = multer({storage});

//!Register
userRoutes.post('/register',upload.single("profilePicture"),register);

//!Login
userRoutes.post('/login',login);

//!Forgot password
userRoutes.post('/forgot-password',fogotPassword);

//!Reset password
userRoutes.post('/reset-password/:resetToken',resetPassword);

//!profile
userRoutes.get('/profile',isLogin,getProfile);

//!Block user
userRoutes.put('/block/:userIdToBlock',isLogin,blockUser);

//!UnBlock user
userRoutes.put('/unblock/:userIdToUnBlock',isLogin,unblockUser);

//!Profile viewers
userRoutes.get('/profile-viewer/:userProfileId',isLogin,profileViewers);

//!follow user
userRoutes.put('/following/:userToFollowId',isLogin,followUser);

//!unfollow user
userRoutes.put('/unfollowing/:userToUnFollowId',isLogin,unFollowUser);

//!Account verification Email
userRoutes.put('/account-verification-email',isLogin,accountVerificationEmail);

//!Account verification
userRoutes.put('/account-verify/:verifyToken',isLogin,verifyAccount);

//*Exports
module.exports = userRoutes;
