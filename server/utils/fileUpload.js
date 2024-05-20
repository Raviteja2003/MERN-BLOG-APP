const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const {CloudinaryStorage,} = require("multer-storage-cloudinary");

dotenv.config();

//configure cloudinary
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_APIKEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})

//Instance of cloudinary storage

const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats:['jpg','png','jpeg'],
    params:{
        folder:"blogify-api",
        transformation:[{width:500,height:500,crop:"limit"}]
    }

})

module.exports = storage;
