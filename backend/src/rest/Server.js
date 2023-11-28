const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");

const Authentication = require("../controller/Authentication");
const Account = require("../controller/Account");
const Comment = require("../controller/Comment");
const Post = require("../controller/Post");
const Chat = require("../controller/Chat");
const Dev = require("../controller/Dev");
const Follow = require("../controller/Follow")

const passportConfig = require("../middleware/PassportConfig");

class Server {
	constructor(port) {
		this.app = express();
		this.port = port;

		this.init();
	}

	init() {
		this.registerMiddleware();
		this.registerRoutes();
	}

	registerMiddleware() {
		this.app.use(cors());
		this.app.use(express.urlencoded({ extended: false }));
		this.app.use(
			session({ secret: "somethingsecret", resave: false, saveUninitialized: false })
		);
		this.app.use(passport.initialize());
		passportConfig(passport); // initialize passport configuration.
		this.app.use(passport.session());

		// JSON parser should be before express.raw
		this.app.use(express.json());
		this.app.use(express.raw({ type: "application/*", limit: "25mb" }));
	}

	registerRoutes() {
		this.app.post("/login", passport.authenticate("local"), Authentication.login);
		this.app.get("/logout", Authentication.logout);

		this.app.post("/account", Account.create);
		this.app.get("/account/:userId", Account.get);
		this.app.put("/account/:userId", Account.update);

		this.app.get("/comment/:postId", Comment.get);
		this.app.post("/comment/:postId", Comment.create);
		this.app.delete("/comment/:commentId", Comment.delete);

		this.app.post("/chat/:chatId", Chat.create);
		this.app.delete("/chat/:messageId", Chat.delete);
		this.app.get("/chat/:chatId", Chat.get);
        
        this.app.get("/followers/:userId", Follow.getFollowers)
        this.app.get("/following/:userId", Follow.getFollowing)
        this.app.post("/follow/:follower/:following", Follow.follow)
        this.app.delete("/unfollow/:follower/:following", Follow.unfollow)

        this.app.post("/post", Post.create);
        this.app.delete("/post/:postId", Post.delete);
        this.app.get("/post", Post.get);

		this.app.get("/table/:tableName", Dev.getTable);
	}

	start() {
		this.app.listen(this.port, () => {
			console.log(`Listening at http://localhost:${this.port}`);
		});
	}
}

module.exports = Server;
