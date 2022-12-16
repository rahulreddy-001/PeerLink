var createError = require("http-errors");
var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var FileStore = require("session-file-store")(session);
var passport = require("passport");

var mongoose = require("mongoose");
var mongoUrl = require("./config").mongoUrl;
mongoose.set("strictQuery", true);
var secretKey = require("./config").secretKey;

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/userRouter");

mongoose
  .connect(mongoUrl)
  .then((db) => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Error connecting to DB");
  });
var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    name: "session-id",
    secret: secretKey,
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use(auth);
app.get("/test", (req, res, next) => {
  res.send("This is test message");
});
function auth(req, res, next) {
  console.log(req.user);
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
