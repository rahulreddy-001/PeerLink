var friendsController = require("../controllers/friends")

var express = require("express");
var router = express.Router();
router.use(express.json());

router.get("/", friendsController.getFriends)
router.put("/", friendsController.putFriend)
 
module.exports = router;