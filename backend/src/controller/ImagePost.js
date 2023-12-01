const DatabaseInstance = require("../database/Database");
const db = DatabaseInstance.getInstance();

class ImagePost {
    static async create(req, res, pid) {
		const { caption, type, file, advertisement } = req.body;
		try {
			const text = `INSERT INTO ImagePost(postID, content) VALUES(${pid}, '${file}');`;
			const data = await db.queryDb(text)
			// res.json(data);
		  } catch (error) {
			console.error(error)
			res.status(500).send("Server Error")
		}
	}
    static async get(req, res) {
		try {
			const data = await db.queryDb("SELECT postID, content FROM ImagePost;")
			console.log(res.json(data));
		  } catch (error) {
			console.error(error)
			res.status(500).send("Server Error")
		}
	}
}

module.exports = ImagePost;
