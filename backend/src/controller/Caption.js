class Caption {
    static async create(req, res) {
		try {
			const text = "INSERT INTO Caption(caption, postID, advertisement?) VALUES($1, $2, $3) RETURNING *"
			const values = ["test caption", 1, 0]
			const data = await this.queryDatabase(text, values)
			console.log(res.json(data.rows[0]))
		  } catch (error) {
			console.error(error)
			res.status(500).send("Server Error")
		}
	}
    static async get(req, res) {
		try {
			const data = await this.queryDatabase("SELECT caption, postID FROM Caption;")
			console.log(res.json(data));
		  } catch (error) {
			console.error(error)
			res.status(500).send("Server Error")
		}
	}
}

module.exports = Caption;
