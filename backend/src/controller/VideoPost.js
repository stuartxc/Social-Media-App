const DatabaseInstance = require("../database/Database");

class VideoPost {
    db = DatabaseInstance.getInstance()
    static async create(req, res, pid) {
		try {
			const text = "INSERT INTO videopost(postID, content) VALUES($1, $2) RETURNING *"
			const values = [pid, req.body.content]
			const data = await db.queryDb(text, values)
			console.log(res.json(data.rows[0]))
		  } catch (error) {
			console.error(error)
			res.status(500).send("Server Error")
		}
	}
    static async get(req, res) {
		try {
			const data = await db.queryDb("SELECT postID, caption FROM videopost;")
			console.log(res.json(data));
		  } catch (error) {
			console.error(error)
			res.status(500).send("Server Error")
		}
	}
}

module.exports = VideoPost;
