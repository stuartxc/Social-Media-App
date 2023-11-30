const Caption = require("./Caption.js");
const TextPost = require("./TextPost.js");
const ImagePost = require("./ImagePost.js");
const VideoPost = require("./VideoPost.js");

const DatabaseInstance = require("../database/Database");
const db = DatabaseInstance.getInstance();
var format = require("pg-format");

class Post {
	static createAssociated(req, res, pid) {
		Caption.create(req, res, pid)
		switch (type) {
			case 0: {
				TextPost.create(req, res, pid);
				break;
			}
			case 1: {
				ImagePost.create(req, res, pid);
				break;
			}
			case 2: {
				VideoPost.create(req, res, pid);
				break;
			}
			default: {
				res.status(501).send("Unidentified Type error in CreatePost");
			}
		}
	}

	static async create(req, res) {
		const { caption, type, advertisement } = req.body;
		const time = Date.now();		
		try {
			const pidData = await db.queryDb(`SELECT MAX(postID) AS max FROM Post;`);
			const pid = pidData[0]["max"] + 1;
			
			const text = 
				`INSERT INTO post (postID, URL, caption, createdBy, timestamp, type) VALUES
				(${pid}, 'placeholderURL', '${caption}', 'user1', to_timestamp(${time} / 1000.0), ${type});`;
			// const values = [pid, "placeholderURL", caption, "stuart", type];
			const data = await db.queryDb(text);

			// this.createAssociated(req, res, pid);
		  } catch (error) {
			console.error(error)
			res.status(500).send("Server Error")
		}
	}

	static async delete(req, res) {
		try {
			const target = req.params.postId;
			// const sql = format("DELETE FROM Post WHERE postID = %L", target);
			const data = await db.queryDb(`DELETE FROM Post WHERE postID = '${target}'`);
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
