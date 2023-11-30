const Database = require("../database/Database");
const db = Database.getInstance();
class Chat {
	static async create(req, res) {
		const { username } = req.user;
		const createChat = `INSERT INTO chat DEFAULT VALUES RETURNING chatId;`;
		const data = await db.queryDb(createChat);
		const chatId = data[0].chatid;

		const joinChat = `INSERT INTO participates (chatId, acc) VALUES ('${chatId}', '${username}');`;
		await db.queryDb(joinChat);
		console.log(username, chatId);
		res.status(200).json({ chatId: chatId });
	}

	static async getAllChats(req, res) {
		const { username } = req.user;
		const getChats = `SELECT * FROM chat WHERE chatId IN (SELECT chatId FROM participates WHERE acc='${username}');`;
		const chats = await db.queryDb(getChats);

		const results = await Promise.all(
			chats.map(async (chat) => {
				const getParticipants = `SELECT acc FROM participates p, chat c WHERE c.chatId=${chat.chatid} AND p.chatId=${chat.chatid};`;
				const participants = await db.queryDb(getParticipants);
				return {
					chatid: chat.chatid,
					participants: participants,
				};
			})
		);

		res.status(200).json(results);
	}
	static async delete(req, res) {}
	static async getChat(req, res) {
		const { chatId } = req.params;
		console.log(req.user);
	}
	static async createMessage(req, res) {}
	static async deleteMessage(req, res) {}
}

module.exports = Chat;
