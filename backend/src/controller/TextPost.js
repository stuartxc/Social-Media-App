const DatabaseInstance = require("../database/Database");
const db = DatabaseInstance.getInstance();

class TextPost {
	
    static async create(req, res, pid) {
		const { caption, type, file, advertisement } = req.body;
		try {
			const text = `INSERT INTO textpost(postID, content) VALUES($1, $2);`;
			const values = [pid, caption]
			const data = await db.queryDbValues(text, values);
			// res.json(data);
		  } catch (error) {
			console.error(error)
			res.status(500).send("Server Error")
		}
	}
    static async get(req, res) {
		try {
			const data = await db.queryDbValues("SELECT postID, content FROM textpost;", [])
			res.json(data);
		  } catch (error) {
			console.error(error)
			res.status(500).send("Server Error")
		}
	}
}

module.exports = TextPost;
