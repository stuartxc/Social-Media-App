const express = require("express");
const { Pool } = require("pg");

const Authentication = require("../middleware/Authentication");
const Account = require("../middleware/Account");
const Comment = require("../middleware/Comment");
const Post = require("../middleware/Post");
const Chat = require("../middleware/Chat");
const Dev = require("../middleware/Dev");

class Server {
    constructor(port) {
        this.app = express();
        this.port = port;

        this.init();
    }

    init() {
        this.registerRoutes();
    }

    async queryDatabase(queryText) {
        const client = await pool.connect();
        try {
            const res = await client.query(queryText);
            return res.rows;
        } finally {
            client.release();
        }
    }

    registerRoutes() {
        this.app.post("/login", Authentication.login);
        this.app.get("/logout", Authentication.logout);

        this.app.post("/account", Account.create);
        this.app.get("/account/:userId", Account.get);
        this.app.put("/account/:userId", Account.update);

        this.app.get("/comment/:postId", Comment.get);
        this.app.post("/comment/:postId", Comment.create);
        this.app.delete("/comment/:commentId", Comment.delete);

        this.app.post("/post", Post.create);
        this.app.delete("/post/:postId", Post.delete);
        this.app.get("/post/:postId", Post.get);

        this.app.post("/chat/:chatId", Chat.create);
        this.app.delete("/chat/:messageId", Chat.delete);
        this.app.get("/chat/:chatId", Chat.get);

        this.app.get("/table/:tableName", Dev.getTable);
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`Listening at http://localhost:${this.port}`);
        });
    }
}

module.exports = Server;
