var express = require("express");

var Friends = require("../models/friends");
var Chats = require("../models/chats");
var User = require("../models/user");

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
  .put((req, res, next) => {
    User.findOne({ username: req.body.friend }).then((resp) => {
      var respStatus = 0;
      if (resp !== null) {
        try {
          Friends.findOne({ username: req.session.passport.user }).then(
            (user) => {
              if (user == null) {
                Friends.create({
                  username: req.session.passport.user,
                  friends: [req.body.friend],
                }).then((user) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json({ success: true, data: user.friends });
                  respStatus = 1;
                });
              } else {
                if (user.friends.includes(req.body.friend)) {
                  if (respStatus === 0) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json({
                      success: false,
                      message: "UserIsInYourList",
                    });
                    respStatus = 1;
                  }
                } else {
                  user.friends.push(req.body.friend);
                  user.save();
                  if (req.session.passport.user !== req.body.friend) {
                    Friends.findOne({ username: req.body.friend }).then(
                      (id) => {
                        if (id == null) {
                          Friends.create({
                            username: req.body.friend,
                            friends: [req.session.passport.user],
                          }).then((user) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json({ success: true, data: user.friends });
                          });
                        } else {
                          id.friends.push(req.session.passport.user);
                          id.save();
                          if (respStatus === 0) {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json({
                              success: true,
                              data: user.friends,
                            });
                            respStatus = 1;
                          }
                        }
                      }
                    );
                  }
                }
              }
            }
          );
        } catch (e) {
          if (respStatus === 0) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ success: false, message: "ServerSideError" });
            respStatus = 1;
          }
        }
      } else {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: false,
          message: "Usernotfound"
        });
      }
    });
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
