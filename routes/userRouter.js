var express = require("express");
var passport = require("passport");
var authenticate = require("../authenticate");

var User = require("../models/user");

var router = express.Router();
router.use(express.json());

router.get("/", (req, res, next) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({ 1: "/users/signup", 2: "/users/signin" });
});

router.post("/signup", (req, res, next) => {
  console.log(req.body);
  User.register(
    new User({ username: req.body.username, name: req.body.name }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: false, error: err });
      } else {
        passport.authenticate("local")(req, res, () => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({
            success: true,
            status: "Registration Successful!",
          });
        });
      }
    }
  );
});

router.post("/signin", passport.authenticate("local"), (req, res, next) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({
    success: true,
    status: "You are successfully logged in!",
  });
});

router.get("/signout", (req, res, next) => {
  try {
    if (req.session) {
      res.status = 200;
      res.clearCookie("session-id");
      res.json({ success: true });
      req.session.destroy();
    } else {
      var err = new Error("You are not logged in!");
      err.status = 403;
      next(err);
    }
  } catch {
    var err = new Error("You are not logged in!");
    err.status = 403;
    next(err);
  }
});
module.exports = router;
