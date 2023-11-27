const Caption = require("./Caption.js");

const DatabaseInstance = require("../database/Database");
var format = require("pg-format");

class Post {
	db = DatabaseInstance.getInstance()

    static async create(req, res) {
		
		try {
			const text = "INSERT INTO Post(postID, URL, caption, createdBy, type) VALUES($1, $2, $3, $4, $5) RETURNING *"
			const values = [1, "placeholderURL", "test caption", "stuart", 0]
			const data = await db.queryDb(text, values)
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
			const data = await db.queryDb(sql)
			console.log(res.json(data.rows[0]))
		  } catch (error) {
			console.error(error)
			res.status(500).send("Server Error")
		}
	}
    static async get(req, res) {
		try {
			const data = await db.queryDb("SELECT postID FROM Post;")
			console.log(res.json(data));
		  } catch (error) {
			console.error(error)
			res.status(500).send("Server Error")
		}
	}
}

module.exports = Post;
