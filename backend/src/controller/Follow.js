const DatabaseInstance = require("../database/Database");

const db = DatabaseInstance.getInstance();
class Follow {
	
    // this.app.post("/follow/:follower/:following", Follow.follow);
	static async follow(req, res, next) {
		const follower = req.params.follower;
        const following = req.params.following;
		try {
			const data = await db.queryDbValues(
				`INSERT INTO follow (follower, following) VALUES ($1, $2);`, [follower, following]
			);

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
			const data = await db.queryDbValues(
				`DELETE FROM follow WHERE follower=$1 AND following=$2;`, [follower, following]
				);

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
			const data = await db.queryDbValues(`SELECT follower FROM follow WHERE following=$1;`, [id]);

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
			const data = await db.queryDbValues(`SELECT following FROM follow WHERE follower=$1;`, [id]);

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
