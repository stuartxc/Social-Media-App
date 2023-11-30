const DatabaseInstance = require("../database/Database");
const jwt = require("jsonwebtoken");

const db = DatabaseInstance.getInstance();
const secretKey = process.env.JWT_SECRET_KEY;
class Authentication {
	// Authenticate token middleware for protected routes
	static authenticateToken(req, res, next) {
		const authHeader = req.headers["authorization"];

		if (authHeader == null) return res.sendStatus(401);
		const token = authHeader.split(" ")[1]; // Bearer <token>
		if (token == null) return res.sendStatus(401);
		// console.log(authHeader);
		jwt.verify(token, secretKey, (err, user) => {
			if (err) return res.sendStatus(403);
			req.user = user;
			next();
		});
	}

	static async login(req, res) {
		const user = { username: req.user.username };
		const token = jwt.sign(user, secretKey, { expiresIn: "1h" });
		return res.json({ message: "Logged in successfully", token: token });
	}

	static async logout(req, res) {}
}

module.exports = Authentication;
