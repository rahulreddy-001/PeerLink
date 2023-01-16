var express = require("express");

var Friends = require("../models/friends");
var Chats = require("../models/chats");

var router = express.Router();

router
  .route("/")
  .get((req, res, next) => {
    Friends.findOne({ username: req.session.passport.user })
      .then(
        (friends) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          if (friends) res.json({ data: friends, success: true });
          else res.json({ success: true, data: { friends: [] } });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Friends.findOne({ username: req.session.passport.user }).then((user) => {
      if (user) {
        if (user.friends.includes(req.body.friend)) {
          let name = [req.session.passport.user, req.body.friend]
            .sort()
            .join(" ");
          Chats.deleteOne({ name: name }).then((r) => {
            user.friends = user.friends.filter((f) => f != req.body.friend);
            user.save().then((user) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json({ success: true });
            });
          });
        } else {
          res.statusCode = 203;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: false, error: "User not found" });
        }
      } else {
        res.statusCode = 203;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: false, error: "No friends found" });
      }
    });
  });

module.exports = router;
