const User = require("../model/User/User")

const checkAccountVerification= async(req,res,next)=>{
    try {
        //Find the user
        const user = await User.findById(req.userAuth._id);
        //check if user is verified
        if(user?.isVerified)
        {
            next();
        }
        else
        {
            res.status(401).json({message:"Account not verified"});
        }
    } catch (error) {
        res.status(500).json({
            message:"Internal server Error",
            error
        })
    }
}

module.exports = checkAccountVerification;