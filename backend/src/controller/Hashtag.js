const DatabaseInstance = require("../database/Database");
const db = DatabaseInstance.getInstance();
var format = require("pg-format");

const POST_URL = "http://localhost:3000/post";

class Hashtag {
	static async get(req, res) {
		const { type, hashtag, postid, h1, h2 } = req.query;
		const values = [];
		if (type == "hashtag" && hashtag) {
		} else if (type == "post" && postid) {
		} else if (type == "avgPerPost") {
			try {
				const sql = `SELECT AVG(hashtag_count) as avg_hashtags_per_post
                    FROM (
                        SELECT postID, COUNT(hashTag) as hashtag_count
                        FROM associateHashtag
                        GROUP BY postID
                    ) as hashtag_counts;`;
				const data = await db.queryDb(sql);
				res.json(data);
			} catch (error) {
				console.error(error);
				res.status(500).send("Server Error");
			}
		} else if (h1 && h2 && h1 != h2) {
            values.push(h1);
            values.push(h2);
			try {
				const sql = `SELECT postID
                    FROM associateHashtag
                    WHERE hashTag IN ($1, $2)
                    GROUP BY postID
                    HAVING COUNT(DISTINCT hashTag) = 2;`;
				const data = await db.queryDbValues(sql, values);
				res.json(data);
			} catch (error) {
				console.error(error);
				res.status(500).send("Server Error");
			}
		} else {
			res.status(500).send("Invalid request");
		}
	}
}

module.exports = Hashtag;
