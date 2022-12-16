var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
	res.send("MSGCLI REST API");
});

module.exports = router;
