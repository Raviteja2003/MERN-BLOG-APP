const mongoose = require('mongoose');

//connect to the database

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.URI);
        console.log("DB connected sucessfully");

    }
    catch(error)
    {
        console.log("DB connection failed",error.message);
    }
}

module.exports = connectDB;
