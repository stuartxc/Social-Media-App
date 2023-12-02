const { Pool } = require("pg");
const DatabaseInstance = require("../database/Database");
const bcrypt = require("bcrypt");

const db = DatabaseInstance.getInstance();
class Account {
	// create a new account
	static async create(req, res, next) {
		const { username, email, password } = req.body;
		try {
			if (!username || !email || !password) {
				return res.status(400).send({ message: "Please fill out all fields" });
			}

			// check if user is already registered
			const dataUser = await db.queryDb(`SELECT * FROM login WHERE username='${username}'`);
			if (dataUser.length > 0) {
				return res.status(400).send({ message: "User already exists" });
			}

			const hashedPassword = await bcrypt.hash(password, 10);
			const insertLogin = `INSERT INTO login (username, password) VALUES ('${username}', '${hashedPassword}');`;
			const insertAccount = `INSERT INTO account (email, username, URL) VALUES ('${email}', '${username}', 'http://localhost/user/${username}');`;

			const dataLogin = await db.queryDb(insertLogin);
			const dataAccount = await db.queryDb(insertAccount);
			res.status(200).send({ result: "success" });
		} catch (error) {
			console.error(error);
			res.status(500).send({ message: "Server Error" });
		}
	}

	// get an account
	static async get(req, res) {
		const id = req.params.userId;
		const values = [];
		console.log(id);
		try {
			values.push(id);
			const sql = `SELECT * FROM account WHERE username=$1;`;
			const data = await db.queryDbValues(sql, values);

			res.json(data);
		} catch (error) {
			console.error(error);
			res.status(500).send("Server Error");
		}
	}

	static async getGeneral(req, res) {
		const { numPosts } = req.query;
		const values = [];
		if (numPosts) {
			try {
				values.push(numPosts);
				const sql = `SELECT createdBy
        FROM Post
        GROUP BY createdBy
        HAVING COUNT(postID) >= $1;`;
				const data = await db.queryDbValues(sql, values);
				res.json(data);
			} catch (error) {
				console.error(error);
				res.status(500).send("Server Error");
			}
		}
	}

	// update an account
	static async update(req, res, next) {}
}
module.exports = Account;
