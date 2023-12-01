const DatabaseInstance = require("../database/Database");
const db = DatabaseInstance.getInstance();

class Caption {
    static async create(req, res, pid) {
		const { caption, type, file, advertisement } = req.body;
		try {
			const text = "INSERT INTO caption (caption, postID, advertisement) VALUES($1, $2, $3)"
			const values = [caption, pid, advertisement]
			const data = await db.queryDbValues(text, values)
			// res.json(data);
		  } catch (error) {
			console.error(error)
			res.status(500).send("Server Error")
		}
	}
    static async get(req, res) {
		try {
			const data = await db.queryDbValues("SELECT caption, postID FROM Caption;")
			console.log(res.json(data));
		  } catch (error) {
			console.error(error)
			res.status(500).send("Server Error")
		}
	}
}

module.exports = Caption;
