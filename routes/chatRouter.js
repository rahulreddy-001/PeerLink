var express = require("express");
var Chats = require("../models/chats");
var User = require("../models/user");
var Friends = require("../models/friends");

var router = express();

router
  .route("/:friend")
  .get((req, res, next) => {
    let name = [req.session.passport.user, req.params.friend].sort().join(" ");

    User.findOne({ username: req.params.friend }).then((resp) => {
      if (resp !== null) {
        Chats.findOne({ name }).then((chat) => {
          if (chat !== null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(chat);
          } else {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.json({
              success: false,
              error: { name: "BadRequest", message: "Chat not found" },
            });
          }
        });
      } else {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: false,
          error: { name: "BadRequest", message: "User not found" },
        });
      }
    });
  })
  .put((req, res, next) => {
    let name = [req.session.passport.user, req.params.friend].sort().join(" ");
    let message = {
      from: req.session.passport.user,
      to: req.params.friend,
      message: req.body.message,
    };
    User.findOne({ username: req.params.friend }).then((resp) => {
      if (resp !== null) {
        Chats.findOne({ name: name }).then((chat) => {
          if (chat === null) {
            Friends.findOne({ username: req.session.passport.user }).then(
              (user) => {
                if (user == null) {
                  Friends.create({
                    username: req.session.passport.user,
                    friends: [req.params.friend],
                  }).then((user) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(user);
                  });
                } else {
                  user.friends.push(req.params.friend);
                  user.save();
                }
              }
            );
            if (req.session.passport.user !== req.params.friend) {
              Friends.findOne({ username: req.params.friend }).then((user) => {
                if (user == null) {
                  Friends.create({
                    username: req.params.friend,
                    friends: [req.session.passport.user],
                  }).then((user) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(user);
                  });
                } else {
                  user.friends.push(req.session.passport.user);
                  user.save();
                }
              });
            }
            Chats.create({
              name: name,
              chats: [message],
            })
              .then(
                (chat) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(chat);
                },
                (err) => next(err)
              )
              .catch((err) => next(err));
          } else {
            chat.chats.push(message);
            chat
              .save()
              .then(
                (chat) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(chat);
                },
                (err) => next(err)
              )
              .catch((err) => next(err));
          }
        });
      } else {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: false,
          error: { name: "BadRequest", message: "User not found" },
        });
      }
    });
  });

module.exports = router;
