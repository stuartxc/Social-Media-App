const { Pool } = require("pg");
const DatabaseInstance = require("../database/Database");

const db = DatabaseInstance.getInstance();
class Account {
	// create a new account
	static async create(req, res, next) {
		const { username, email, password } = req.body;
		const insertLogin = `INSERT INTO login (username, password) VALUES ('${username}', '${password}');`;
		const insertAccount = `INSERT INTO account (email, username, URL) VALUES ('${username}', '${email}', 'http://localhost/user/${username}');`;
		try {
			const dataLogin = await db.queryDb(insertLogin);
			const dataAccount = await db.queryDb(insertAccount);
			console.log(dataLogin, dataAccount);
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
			const data = await this.db.queryDb(`SELECT * FROM test WHERE id=${id};`);

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
