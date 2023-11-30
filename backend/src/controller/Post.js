const Caption = require("./Caption.js");

const DatabaseInstance = require("../database/Database");
const db = DatabaseInstance.getInstance();
var format = require("pg-format");

class Post {
	static async create(req, res) {
		try {
			const text =
				"INSERT INTO Post(postID, URL, caption, createdBy, type) VALUES($1, $2, $3, $4, $5) RETURNING *";
			const values = [1, "placeholderURL", "test caption", "stuart", 0];
			const data = await db.queryDb(text, values);
			console.log(res.json(data.rows[0]));
			Caption.create(req, res);
		} catch (error) {
			console.error(error);
			res.status(500).send("Server Error");
		}
	}
	static async delete(req, res) {
		try {
			const target = req.params.id;
			const sql = format("DELETE FROM Post WHERE postID = %L", target);
			const data = await db.queryDb(sql);
			console.log(res.json(data.rows[0]));
		} catch (error) {
			console.error(error);
			res.status(500).send("Server Error");
		}
	}
	static async get(req, res) {
		try {
			const { username, postId } = req.query;
			let data;
			if (username) {
				data = await db.queryDb(`SELECT * FROM Post WHERE createdBy='${username}';`);
				res.json(data);
			} else if (postId) {
				data = await db.queryDb(`SELECT * FROM Post WHERE postID=${postId};`);
				console.log(res.json(data));
			} else {
				data = await db.queryDb("SELECT * FROM Post;");
				console.log(res.json(data));
			}
		} catch (error) {
			console.error(error);
			res.status(500).send("Server Error");
		}
	}

	static async getContent(req, res) {
		try {
			const { postId, type } = req.query;
			let data;
			if (postId && type) {
				if (type ==0) {
					data = await db.queryDb(`SELECT * FROM TextPost WHERE postID=${postId};`);
					res.json(data);
					// TODO
				// } else if (type ==1) {
				// 	data = await db.queryDb(`SELECT * FROM ImagePost WHERE postID=${postId};`);
				// } else if (type==2) {
				// 	data = await db.queryDb(`SELECT * FROM VideoPost WHERE postID=${postId};`);
				} else {
					res.status(500).send("Invalid Post Type");
				}
				
			} else {
				res.status(500).send("Invalid Fetch URL");
			}
		} catch (error) {
			console.error(error);
			res.status(500).send("Server Error");
		}
	}
}

module.exports = Post;
