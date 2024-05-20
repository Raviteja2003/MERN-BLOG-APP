const http = require("http");
const express = require("express");
const userRoutes = require("./routes/users/userRoutes");
const connectDB = require("./config/database");
const dotenv = require("dotenv");
const { notFound, globalErrorHandler } = require("./middleware/globalErrorHandler");
const categoryRouter = require("./routes/category/categoryRouter");
const postRouter = require("./routes/post/postRouter");
const commentRouter = require("./routes/comment/commentRouter");
const sendEmail = require("./utils/sendEmail");
//sendEmail("ravitejat0406@gmail.com","abcdefgh");
//Server creation
const app = express();

//connectDB
dotenv.config();
connectDB();

//middleware
app.use(express.json());//pass the data

//Routes
app.use('/api/v1/users',userRoutes);
app.use('/api/v1/categories',categoryRouter);
app.use('/api/v1/posts',postRouter);
app.use('/api/v1/comments',commentRouter);

//Not found middleware
app.use(notFound);

//Error middlewares
app.use(globalErrorHandler);

const server = http.createServer(app);

//start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT,console.log(`Server is running on port ${PORT}`));

