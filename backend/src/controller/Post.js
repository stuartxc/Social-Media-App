const Caption = require("./Caption.js");
const TextPost = require("./TextPost.js");
const ImagePost = require("./ImagePost.js");
const VideoPost = require("./VideoPost.js");

const DatabaseInstance = require("../database/Database");
const db = DatabaseInstance.getInstance();
var format = require("pg-format");
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const POST_URL = `${BACKEND_URL}/post`;

class Post {
	static async create(req, res) {
		const { caption, type, file, advertisement, hashtags } = req.body;
		const { username } = req.user;
		const time = Date.now();
		try {
			const pidData = await db.queryDb(`SELECT MAX(postID) AS max FROM Post;`);
			const pid = pidData[0]["max"] + 1;
			if (type !== "0" && type !== "1" && type !== "2") {
				console.error("Type can only be 0, 1, or 2");
				res.status(500).send("Type can only be 0, 1, or 2");
				return;
			}
			const typeInt = parseInt(type);
			console.log(1);
			let promises = [];
			let promises2 = [];
			await hashtags.forEach((hashtag) => {
				db.queryDbValues(`SELECT * FROM Hashtags WHERE text=$1`, [hashtag.text]).then((res) => {
					if (res.length == 0) {
						try {
							// db.queryDb(
							// 	`INSERT INTO Hashtags (text, color) VALUES ('${hashtag.text}', '${hashtag.color.substring(1)}')`
							// );
							db.queryDbValues(
								`INSERT INTO Hashtags (text, color) VALUES ($1, $2)`, [hashtag.text, hashtag.color.substring(1)]
							);
						} catch {}
					}
				});
			});
			console.log(2);
			await Promise.all(promises);
			console.log(3);
			await Promise.all(promises2);
			console.log(4);
			// const text = `INSERT INTO post (postID, URL, caption, createdBy, timestamp, type) VALUES
			// 	(${pid}, '${POST_URL}/${pid}', '${caption}', '${username}', to_timestamp(${time} / 1000.0), ${typeInt});`;
			const text = `INSERT INTO post (postID, URL, caption, createdBy, timestamp, type) VALUES
				($1, $2, $3, $4, to_timestamp($5 / 1000.0), $6);`;
			const values = [pid, `${POST_URL}/${pid}`, caption, username, time, typeInt];
			const data = await db.queryDbValues(text, values);
			const captionData = await Caption.create(req, res, pid);
			console.log("Aftercap");
			switch (typeInt) {
				case 0: {
					console.log("textpost");
					const textPostData = await TextPost.create(req, res, pid);
					break;
				}
				case 1: {
					console.log("imagepost");
					const imagePostData = await ImagePost.create(req, res, pid);
					break;
				}
				default: {
					console.log("videopost");
					const videoPostData = await VideoPost.create(req, res, pid);
					break;
				}
			}

			const promises3 = [];

			hashtags.forEach((hashtag) => {
				promises3.push(
					// db.queryDb(
					// 	`INSERT INTO associateHashtag (postID, hashtag) VALUES (${pid}, '${hashtag.text}')`
					// )
					db.queryDbValues(
						`INSERT INTO associateHashtag (postID, hashtag) VALUES ($1, $2)`, [pid, hashtag.text]
					)
				);
			});
			await Promise.all(promises3);
			console.log(6);
			res.json(data);
		} catch (error) {
			console.error(error);
			res.status(500).send("Server Error");
		}
	}

	static async delete(req, res) {
		try {
			const target = req.params.postId;
			const { username } = req.user;
			const dataUser = await db.queryDbValues(
				`SELECT username FROM account WHERE username=$1;`, [username]
			);
			if (dataUser.length <= 0) {
				return res.status(469).send({ message: "Unexpected error: User does not exist" });
			}
			const user = dataUser[0]["username"];
			const checkCreator = await db.queryDbValues(
				`SELECT createdBy FROM Post WHERE postID = $1;`, [target]
			);
			if (checkCreator.length <= 0) {
				return res.status(404).send({ message: "Post does not exist" });
			}
			const creator = checkCreator[0]["createdby"];
			if (user !== creator) {
				console.error("To delete a post, the user must be the creator of the post.");
				res.status(403).send("User isn't authorized to delete this post");
			} else {
				const data = await db.queryDbValues(`DELETE FROM Post WHERE postID = $1`, [target]);
				res.json(data);
			}
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
			let values = [];

			if (username) {
				values.push(username)
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
					WHERE Post.createdBy=$1;
				`;
			} else if (postId) {
				values.push(postId)
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
					WHERE Post.postID=$1;
				`;
			} else {
				query = "SELECT * FROM Post;";
			}

			data = await db.queryDbValues(query, values);
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
							follow.follower = $1
						ORDER BY 
							Post.timestamp DESC
						LIMIT $2
						OFFSET $3;`;
			const data = await db.queryDbValues(sql, [user, limit, offset]);
			res.json(data);
		} catch (error) {
			console.error(error);
			res.status(500).send("Server Error");
		}
	}
}

module.exports = Post;
