var cookieParser = require("cookie-parser");
var logger       = require("morgan");
var cors         = require("cors");

module.exports = function apply(app, express){
    app.use(cors());
    app.use(logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
}