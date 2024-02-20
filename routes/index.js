
var path = require("path")
var authMiddleware = require("../middlewares/authMiddleware")

var usersRouter    = require("./user.route");
var friendsRouter  = require("./friends.route");
var chatRouter     = require("./chat.route");

module.exports = function registerRoutes(app, express){
    app.get("/", function (req, res, next) {
        req.cookies.access_token ? next() : res.redirect("/signin")
    });

    app.get("/signin", (_, res) => {
        return res.sendFile(path.join(process.cwd(), "public", "signin.html"));
    });
    app.get("/signup", (_, res) => {
        return res.sendFile(path.join(process.cwd(), "public", "signup.html"));
    });
    
    app.use("/user", usersRouter);
    app.use(authMiddleware, express.static("public"));
    app.get("/api/user", authMiddleware, (req, res) => {
        res.status(200).send({ user: req.username });
    });
    app.use("/api/friends", authMiddleware, friendsRouter);
    app.use("/api/chat", authMiddleware, chatRouter);
}
