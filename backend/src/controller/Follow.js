const DatabaseInstance = require("../database/Database");

const db = DatabaseInstance.getInstance();
class Follow {
	
    // this.app.post("/follow/:follower/:following", Follow.follow);
	static async follow(req, res, next) {
		const follower = req.params.follower;
        const following = req.params.following;
		try {
			const data = await db.queryDb(`INSERT INTO follow (follower, following) VALUES ('${follower}', '${following}');`);

			res.json(data);
		} catch (error) {
			console.error(error);
			res.status(500).send("Server Error");
		}
	}

    // this.app.delete("/unfollow/:follower/:following", Follow.unfollow);
    static async unfollow(req, res, next) {
		const follower = req.params.follower;
        const following = req.params.following;
		try {
			const data = await db.queryDb(`DELETE FROM follow WHERE follower='${follower}' AND following='${following}';`);

			res.json(data);
		} catch (error) {
			console.error(error);
			res.status(500).send("Server Error");
		}
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
