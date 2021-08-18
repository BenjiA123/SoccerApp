const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
var cors = require("cors");
const AppError = require('./utils/appError')
const globalErrorHandler = require("./controllers/errorController")
const userRoutes = require("./routes/userRoute");
const chatRoutes = require("./routes/chatRoute");
const postRoutes = require("./routes/postsRoute");
const commentRoutes = require("./routes/commentRoute");
app.use(cors());
// mongodb+srv://Ben:queen1234@cluster0-rjlm3.mongodb.net/test?retryWrites=true&w=majority
// mongodb://localhost:27017/posts

// const DB = process.env.DATABASE.replace(
//   "<PASSWORD>",
//   process.env.DATABASE_PASSWORD
// );


mongoose
  .connect(
    "mongodb://localhost:27017/blurt",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to database ");
  })
  .catch((err) => {
    console.log("Connection to database failed  " + err);
  });
  app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({extended:true,limit:'10kb'}))
app.use("/images", express.static(path.join("backend/images")));

app.use("/", express.static(path.join(`${__dirname}`)));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET ,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  next();
});

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/comments", commentRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler)
module.exports = app;
