const DatabaseInstance = require("../database/Database");
const db = DatabaseInstance.getInstance();
class Authentication {
	static async login(req, res) {
		return res.json({ message: "Logged in successfully" });
	}

	static async logout(req, res) {}
}

module.exports = Authentication;
