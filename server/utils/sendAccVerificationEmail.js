const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

//create the function to send the email

const sendAccVerificationEmail = async(to,verifyToken)=>{
    try {
        //create the transport
        const transporter = nodemailer.createTransport({
            host:"smtp.gmail.com",
            port:587,
            secure:false,
            auth:{
                user:process.env.EMAIL,
                pass:process.env.GMAIL_PASS,
            }
        })

        //create the message
        const message = {
            to,
            subject:"Account verication",
            html:
            `
            <p>You are receiving this email because you (or someone else) have requested to verify your account.</p>
            <p>Please click on the following link, or paste this into your browser to complete the process:</p>
            <p>https://localhost:3000/account-verify/${verifyToken}</p>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            `,
        };

        //send the mail
        const info = await transporter.sendMail(message);
        console.log("Email sent",info.messageId);
    } catch (error) {
        console.log(error);
        throw new Error("Email sending failed");
    }
}

module.exports = sendAccVerificationEmail;