const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    const payload = {
        user :{
            id: user.id,
        }
    }

    //sign the token with a secret key
    const token = jwt.sign(payload,process.env.JWT,{
        expiresIn:36000,
    });
    return token;
}

module.exports = generateToken;

