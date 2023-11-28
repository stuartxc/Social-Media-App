const DatabaseInstance = require("../database/Database");

const db = DatabaseInstance.getInstance();
class Follow {
	
	static async follow(req, res, next) {
		
	}

    static async unfollow(req, res, next) {
		
	}

	// get an account
	static async getFollowers(req, res) {
		const id = req.params.userId;
		console.log(id);
		try {
			const data = await db.queryDb(`SELECT follower FROM follow WHERE following='${id}';`);

			res.json(data);
		} catch (error) {
			console.error(error);
			res.status(500).send("Server Error");
		}
	}

    static async getFollowing(req, res) {
		const id = req.params.userId;
		console.log(id);
		try {
			const data = await db.queryDb(`SELECT following FROM follow WHERE follower='${id}';`);

			res.json(data);
		} catch (error) {
			console.error(error);
			res.status(500).send("Server Error");
		}
	}

	// update an account
	static async update(req, res, next) {}
}
module.exports = Follow;
