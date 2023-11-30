const DatabaseInstance = require("../database/Database");
const db = DatabaseInstance.getInstance();

class ImagePost {
    static async create(req, res, pid) {
		const { caption, type, file, advertisement } = req.body;
		try {
			const binary = this.convert(file);
			const text = `INSERT INTO imagepost(postID, content) VALUES(${pid}, '${binary}') RETURNING *`
			const values = [pid, file]
			const data = await db.queryDbValues(text, values)
			console.log(res.json(data.rows[0]))
		  } catch (error) {
			console.error(error)
			res.status(500).send("Server Error")
		}
	}
	static convert(file) {
		fr = new FileReader();
		return fr.readAsBinaryString(file);
	}
    static async get(req, res) {
		try {
			const data = await db.queryDbValues("SELECT postID, content FROM imagepost;")
			console.log(res.json(data));
		  } catch (error) {
			console.error(error)
			res.status(500).send("Server Error")
		}
	}
}

module.exports = ImagePost;
