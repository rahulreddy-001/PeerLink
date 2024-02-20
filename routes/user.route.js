var userController = require("../controllers/user")

var express = require("express");
var router = express.Router();
router.use(express.json());

router.post('/signin', userController.signin)
router.post('/signup', userController.signup)
router.get('/signout', userController.signout)

module.exports = router;