import Caption from ".Caption.js"

var format = require("pg-format");

class Post {
    static async create(req, res) {
		try {
			const text = "INSERT INTO Post(postID, URL, caption, createdBy, type) VALUES($1, $2, $3, $4, $5) RETURNING *"
			const values = [1, "placeholderURL", "test caption", "stuart", 0]
			const data = await this.queryDatabase(text, values)
			console.log(res.json(data.rows[0]))
			Caption.create(req, res)
		  } catch (error) {
			console.error(error)
			res.status(500).send("Server Error")
		}
	}
    static async delete(req, res) {
		try {
			const target = req.params.id
			const sql = format("DELETE FROM Post WHERE postID = %L", target)
			const data = await this.queryDatabase(sql)
			console.log(res.json(data.rows[0]))
		  } catch (error) {
			console.error(error)
			res.status(500).send("Server Error")
		}
	}
    static async get(req, res) {
		try {
			const data = await this.queryDatabase("SELECT postID FROM Post;")
			console.log(res.json(data));
		  } catch (error) {
			console.error(error)
			res.status(500).send("Server Error")
		}
	}
}

module.exports = Post;
