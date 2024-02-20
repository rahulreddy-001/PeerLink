var express = require("express");
const app = express();

const MONGO_URL = require("./config").MONGO_URL;
var initDB = require("./database/init")
var applyMiddlewares = require("./middlewares/apply")
var registerRoutes = require("./routes")

initDB(MONGO_URL)
applyMiddlewares(app, express)
registerRoutes(app, express)

app.use(function (_, res) {
  res.status(404).send({ success: false, message: "Not Found"})
});

module.exports = app;