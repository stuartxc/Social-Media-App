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
				return res.status(400).json({ message: "Please fill out all fields" });
			}

			// check if user is already registered
			const dataUser = await db.queryDb(`SELECT * FROM login WHERE username='${username}'`);
			if (dataUser.length > 0) {
				return res.status(400).json({ message: "User already exists" });
			}

			const hashedPassword = await bcrypt.hash(password, 10);
			const insertLogin = `INSERT INTO login (username, password) VALUES ('${username}', '${hashedPassword}');`;
			const insertAccount = `INSERT INTO account (email, username, URL) VALUES ('${username}', '${email}', 'http://localhost/user/${username}');`;

			const dataLogin = await db.queryDb(insertLogin);
			const dataAccount = await db.queryDb(insertAccount);
			res.status(200).send({ result: "success" });
		} catch (error) {
			console.error(error);
			res.status(500).send("Server Error");
		}
	}

	// get an account
	static async get(req, res) {
		const id = req.params.userId;
		console.log(id);
		try {
			const data = await db.queryDb(`SELECT * FROM account WHERE username='${id}';`);

			res.json(data);
		} catch (error) {
			console.error(error);
			res.status(500).send("Server Error");
		}
	}

	// update an account
	static async update(req, res, next) {}
}
module.exports = Account;
