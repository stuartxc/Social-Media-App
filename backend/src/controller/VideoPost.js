const DatabaseInstance = require("../database/Database");
const db = DatabaseInstance.getInstance();

class VideoPost {
    static async create(req, res, pid) {
		const { caption, type, file, advertisement } = req.body;
		try {
			const text = `INSERT INTO VideoPost(postID, content) VALUES(${pid}, '${file}');`;
			const data = await db.queryDb(text)
			// res.json(data);
		  } catch (error) {
			console.error(error)
			res.status(500).send("Server Error")
		}
	}

	// 	// Close the large object
	// 	obj.close();

	// 	// Now insert the row into imageslo
	// 	PreparedStatement ps = conn.prepareStatement("INSERT INTO imageslo VALUES (?, ?)");
	// 	ps.setString(1, file.getName());
	// 	ps.setInt(2, oid);
	// 	ps.executeUpdate();
	// 	ps.close();
	// 	fis.close();
	// }
    static async get(req, res) {
		try {
			const data = await db.queryDb("SELECT postID, caption FROM VideoPost;")
			console.log(res.json(data));
		  } catch (error) {
			console.error(error)
			res.status(500).send("Server Error")
		}
	}
}

module.exports = VideoPost;
