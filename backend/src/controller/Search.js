const DatabaseInstance = require("../database/Database");
const db = DatabaseInstance.getInstance();

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SEARCH_URL = `${BACKEND_URL}/search`;

class Search {
	static async getPosts(req, res) {
		try {
			const { postId, caption, createdBy, type, postTime } = req.query;
			var query = `SELECT * FROM Post WHERE `;
			var values = [];
			var i = 1;
			if (postId !== undefined) {
				const pid = parseInt(postId);
				query += `postID=$${i} AND `;
				values.push(pid);
				i++;
			}
			if (caption !== undefined) {
				query += `caption=$${i} AND `;
				values.push(caption);
				i++;
			}
			if (type !== undefined) {
				const typeInt = parseInt(type);
				query += `type=$${i} AND `;
				values.push(typeInt);
				i++;
			}
			if (createdBy !== undefined) {
				query += `createdBy=$${i} AND `;
				values.push(createdBy);
				i++;
			}
			if (postTime !== undefined) {
				query += `timestamp=$${i} AND `;
				values.push(postTime);
				i++;
			}
			let finalQuery = query.substring(0, query.length - 5) + ";";
			const data = await db.queryDbValues(finalQuery, values);
			if (data.length <= 0) {
				return res.status(404).send({ message: "No such posts exist" });
			}
			console.log(data[0]);
			res.json(data);
		} catch (error) {
			console.error(error);
			res.status(500).send("Server Error");
		}
	}

	static async getUsers(req, res) {
		console.log("get users request");
		try {
			const { username, accountTime, following, followers } = req.query;
			console.log(username);
			console.log(accountTime);
			console.log(following);
			console.log(following);
			const data = await db.queryDb(`SELECT * FROM Account;`);
			res.json(data);
		} catch (error) {
			console.error(error);
			res.status(500).send("Server Error");
		}
	}

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
