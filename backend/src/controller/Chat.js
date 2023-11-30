const Database = require("../database/Database");
const db = Database.getInstance();
class Chat {
	static async create(req, res) {
		try {
			const { username } = req.user;
			const createChat = `INSERT INTO chat DEFAULT VALUES RETURNING chatId;`;
			const data = await db.queryDb(createChat);
			const chatId = data[0].chatid;

			const joinChat = `INSERT INTO participates (chatId, acc) VALUES ('${chatId}', '${username}');`;
			await db.queryDb(joinChat);
			console.log(username, chatId);
			res.status(200).json({ chatId: chatId });
		} catch (error) {
			console.error(error);
		}
	}

	static async getAllChats(req, res) {
		try {
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
		} catch (error) {
			console.error(error);
		}
	}
	static async delete(req, res) {}
	static async getChat(req, res) {
		try {
			const { chatId } = req.params;
			console.log(req.user);

			// get all messages sorted on the timestamp, newest first
			const getMessages = `SELECT * FROM message WHERE chatId=${chatId} ORDER BY timeAndDate ASC;`;
			const messages = await db.queryDb(getMessages);
			res.status(200).json(messages);
		} catch (error) {
			console.error(error);
		}
	}
	static async createMessage(req, res) {
		try {
			const { username } = req.user;
			const { chatId, message } = req.body;
			const timeNow = Date.now();
			const createMessage = `INSERT INTO message (chatId, account, timeAndDate, contents) VALUES ('${chatId}', '${username}', TO_TIMESTAMP(${timeNow} / 1000.0),'${message}') RETURNING timeAndDate;`;
			const data = await db.queryDb(createMessage);
			res.status(200).json({ timeanddate: data[0].timeanddate });
		} catch (error) {
			console.error(error);
			res.status(400).json({ message: "Error creating message" });
		}
	}
	static async deleteMessage(req, res) {}
}

module.exports = Chat;
