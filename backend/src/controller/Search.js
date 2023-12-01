const DatabaseInstance = require("../database/Database");
const db = DatabaseInstance.getInstance();
var format = require("pg-format");

const SEARCH_URL = "http://localhost:3000/search";

class Search {

	static async get(req, res) {
		// try {
		// 	const { username, postId } = req.query;
		// 	let data;
		// 	if (username) {
		// 		data = await db.queryDb(`SELECT * FROM Post WHERE createdBy='${username}';`);
		// 		res.json(data);
		// 	} else if (postId) {
		// 		data = await db.queryDb(`SELECT * FROM Post WHERE postID=${postId};`);
		// 		console.log(res.json(data));
		// 	} else {
		// 		data = await db.queryDb("SELECT * FROM Post;");
		// 		console.log(res.json(data));
		// 	}
		// } catch (error) {
		// 	console.error(error);
		// 	res.status(500).send("Server Error");
		// }
		try {
			const { username, postId } = req.query;
			let data;
			let query = "";

			if (username) {
				query = `
					SELECT Post.*, 
						CASE 
							WHEN Post.type = 0 THEN TextPost.content
							WHEN Post.type = 1 THEN encode(ImagePost.content, 'base64')
        					WHEN Post.type = 2 THEN encode(VideoPost.content, 'base64')
						END AS content
					FROM Post
					LEFT JOIN TextPost ON Post.postID = TextPost.postID AND Post.type = 0
					LEFT JOIN ImagePost ON Post.postID = ImagePost.postID AND Post.type = 1
					LEFT JOIN VideoPost ON Post.postID = VideoPost.postID AND Post.type = 2
					WHERE Post.createdBy='${username}';
				`;
			} else if (postId) {
				query = `
					SELECT Post.*, 
						CASE 
							WHEN Post.type = 0 THEN TextPost.content
							WHEN Post.type = 1 THEN encode(ImagePost.content, 'base64')
        					WHEN Post.type = 2 THEN encode(VideoPost.content, 'base64')
						END AS content
					FROM Post
					LEFT JOIN TextPost ON Post.postID = TextPost.postID AND Post.type = 0
					LEFT JOIN ImagePost ON Post.postID = ImagePost.postID AND Post.type = 1
					LEFT JOIN VideoPost ON Post.postID = VideoPost.postID AND Post.type = 2
					WHERE Post.postID=${postId};
				`;
			} else {
				query = "SELECT * FROM Post;";
			}

			data = await db.queryDb(query);
			res.json(data);
		} catch (error) {
			console.error(error);
			res.status(500).send("Server Error");
		}
	}

	static async getContent(req, res) {}

	// this.app.get("/post/:user", Post.getFeed);
	static async getFeed(req, res) {
		try {
			const user = req.params.user;
			const { limit, page } = req.query;
			const offset = limit * (page - 1);
			console.log(limit + " " + offset);
			const sql = `SELECT Post.*,
							CASE 
								WHEN Post.type = 0 THEN TextPost.content
								WHEN Post.type = 1 THEN encode(ImagePost.content, 'base64')
								WHEN Post.type = 2 THEN encode(VideoPost.content, 'base64')
							END AS content
						FROM 
							Post
							LEFT JOIN TextPost ON Post.postID = TextPost.postID AND Post.type = 0
							LEFT JOIN ImagePost ON Post.postID = ImagePost.postID AND Post.type = 1
							LEFT JOIN VideoPost ON Post.postID = VideoPost.postID AND Post.type = 2
						INNER JOIN 
							follow ON Post.createdBy = follow.following
						WHERE 
							follow.follower = '${user}'
						ORDER BY 
							Post.timestamp DESC
						LIMIT ${limit}
						OFFSET ${offset};`;
			const data = await db.queryDb(sql);
			res.json(data);
		} catch (error) {
			console.error(error);
			res.status(500).send("Server Error");
		}
	}
}

module.exports = Search;
