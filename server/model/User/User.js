const mongoose = require('mongoose');
const crypto = require("crypto");

//schema
const userSchema = new mongoose.Schema(
    {
        username:{
            type : String,
            required: true,
        },
        email:{
            type : String,
            required: true,
        },
        role:{
            type : String,
            required: true,
            enum:["user","admin"],
            default:"user",
        },
        password:{
            type : String,
            required: true,
        },
        lastLogin:{
            type : Date,
            default:Date.now,
        },
        isVerified:{
            type : Boolean,
            default:false,
        },
        accountLevel:{
            type : String,
            enum:["bronze","silver","gold"],
            default:"bronze",
        },
        profilePicture:{
            type : String,
            default:"",
        },
        coverImage:{
            type : String,
            default:false,
        },
        bio:{
            type:String,
        },
        location:{
            type:String,
        },
        notificationPreferences:{
            email:{type:String,default:true},
        },
        gender:{
            type:String,
            enum:["male","female","prefer not to say"]
        },
        profileViewrs:[{type:mongoose.Schema.Types.ObjectId, ref:"User"}],
        followers:[{type:mongoose.Schema.Types.ObjectId, ref:"User"}],
        following:[{type:mongoose.Schema.Types.ObjectId, ref:"User"}],
        blockedUsers:[{type:mongoose.Schema.Types.ObjectId, ref:"User"}],
        posts:[{type:mongoose.Schema.Types.ObjectId, ref:"Post"}],
        likedPosts:[{type:mongoose.Schema.Types.ObjectId, ref:"Post"}],
        passwordResetToken:{
            type:String,
        },
        passwordResetExpires:{
            type:Date,
        },
        accountVerificationToken:{
            type:String,
        },
        accountVerificationExpires:{
            type:Date,
        },
    },
    {
        timestamps:true,
        toJSON:{
            virtuals:true,
        },
        toObject:{
            virtuals:true,
        }
    }
);

//Generate password reset Token
userSchema.methods.generatePasswordResetToken = function(){
    //generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    //Assign resetToken to the passwordResetToken field
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    //update passwordResetExpires field and when to expire
    this.passwordResetExpires = Date.now()+10*60*1000 //expires in 10 mins

    return resetToken;

}

//Generate Token for account verification
userSchema.methods.generateAccountVerificationToken = function(){
    //generate token
    const verifyToken = crypto.randomBytes(20).toString('hex');

    //Assign resetToken to the accountVerificationToken field
    this.accountVerificationToken = crypto.createHash('sha256').update(verifyToken).digest('hex');

    //update accountVerificationExpires field and when to expire
    this.accountVerificationExpires = Date.now()+10*60*1000 //expires in 10 mins

    return verifyToken;

}
//compile schema to model
const User = mongoose.model("User",userSchema);
module.exports=User;