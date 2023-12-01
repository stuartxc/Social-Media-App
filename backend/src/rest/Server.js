const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const io = require("socket.io");
const http = require("http");
const jwt = require("jsonwebtoken");

const Authentication = require("../controller/Authentication");
const Account = require("../controller/Account");
const Comment = require("../controller/Comment");
const Post = require("../controller/Post");
const Chat = require("../controller/Chat");
const Dev = require("../controller/Dev");
const Follow = require("../controller/Follow");
const Likes = require("../controller/Likes");
const Search = require("../controller/Search");

const secretKey = process.env.JWT_SECRET_KEY;

const passportConfig = require("../middleware/PassportConfig");

class Server {
	constructor(port) {
		this.app = express();
		this.port = port;
		this.server = http.createServer(this.app);
		this.io = io(this.server, {
			cors: {
				origin: "*",
				methods: ["GET", "POST", "DELETE", "PUT"],
			},
		});
		this.init();
	}

	init() {
		this.registerSocket();
		this.registerMiddleware();
		this.registerRoutes();
	}

	registerSocket() {
		this.io.on("connection", (socket) => {
			console.log("A new connection has occured");

			socket.on("join-chat", ({ chatId }) => {
				Chat.socketJoinChat(socket, chatId);
			});

			socket.on("send-message", ({ chatId, message }) => {
				Chat.socketSendMessage(socket, chatId, message);
			});

			// socket.on("leave-chat", Chat.socketLeaveChat);
			socket.on("disconnect", () => {
				console.log("A user has disconnected");
			});
		});
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

		this.io.use((socket, next) => {
			const token = socket.handshake.auth.token;

			if (!token) {
				console.log("Authentication error for socket");
				return next(new Error("Authentication error, no token provided"));
			}

			jwt.verify(token, secretKey, (err, user) => {
				if (err) return next("Authentication error, bad token");
				socket.user = user;

				console.log("Socket user registered and authenticated, ", user.username);
				next();
			});
		});
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

		this.app.post("/post", Authentication.authenticateToken, Post.create);
		this.app.delete("/post/:postId", Authentication.authenticateToken, Post.delete);
		this.app.get("/post/:postId", Post.get);
		this.app.get("/post/feed/:user", Post.getFeed);

		this.app.post("/chat", Authentication.authenticateToken, Chat.create);
		this.app.put("/chat/join/:chatId", Authentication.authenticateToken, Chat.joinChat);
		this.app.delete("/chat/leave/:chatId", Authentication.authenticateToken, Chat.leaveChat);
		this.app.get("/chat", Authentication.authenticateToken, Chat.getAllChats);
		this.app.delete("/chat/:chatId", Authentication.authenticateToken, Chat.deleteChat);
		this.app.get("/chat/:chatId", Authentication.authenticateToken, Chat.getChat);

		this.app.post("/chat/message", Authentication.authenticateToken, Chat.createMessage);
		this.app.put("/chat/message", Authentication.authenticateToken, Chat.editMessage);

		this.app.post("/chat/count", Authentication.authenticateToken, Chat.countChats);

		this.app.get("/followers/:userId", Follow.getFollowers);
		this.app.get("/following/:userId", Follow.getFollowing);
		this.app.post("/follow/:follower/:following", Follow.follow);
		this.app.delete("/unfollow/:follower/:following", Follow.unfollow);

		this.app.post("/post", Post.create);
		this.app.delete("/post/:postId", Post.delete);
		this.app.get("/post", Post.get);
		this.app.get("/post/content", Post.getContent);

		this.app.post("/likes/:postId/:userId", Likes.like);
		this.app.get("/likes/:postId", Likes.getLikesByPost);
		this.app.delete("/likes/:postId/:userId", Likes.unLike);

		this.app.get("/table/:tableName", Dev.getTable);

		this.app.get("/search", Search.get);
	}

	start() {
		this.server.listen(this.port, () => {
			// need to use this.server for socket.io
			console.log(`Server listening on port ${this.port}`);
		});
	}
}

module.exports = Server;
