var createError = require("http-errors");
var express = require("express");
var cors = require("cors");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var passport = require("passport");
var session = require("express-session");
var MongoDBStore = require("connect-mongodb-session")(session);

var mongoUrl = require("./config").mongoUrl;
var secretKey = require("./config").secretKey;

var store = new MongoDBStore({
  uri: mongoUrl,
  collection: "userSessions",
});

var mongoose = require("mongoose");
mongoose.set("strictQuery", true);

var usersRouter = require("./routes/userRouter");
var friendsRouter = require("./routes/friendsRouter");
var chatRouter = require("./routes/chatRouter");

mongoose
  .connect(mongoUrl)
  .then((db) => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Error connecting to DB");
  });
var app = express();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    name: "session-id",
    secret: secretKey,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    saveUninitialized: false,
    resave: true,
    store: store,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));
app.use("/user", usersRouter);
app.use(auth);
app.use("/api/friends", friendsRouter);
app.use("/api/chat", chatRouter);

function auth(req, res, next) {
  if (!req.user) {
    var err = new Error("You are not authenticated!");
    err.status = 403;
    next(err);
  } else {
    next();
  }
}

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  console.log(err);
  res.status(err.status || 500);
  res.send({ success: false, error: err.message });
});

module.exports = app;
