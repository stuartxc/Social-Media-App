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
	static async deleteChat(req, res) {
		try {
			const { chatId } = req.params;
			const { username } = req.user;
			const doesParticipate = await Chat.isInChat(username, chatId);

			if (doesParticipate) {
				const deleteChat = `DELETE FROM chat WHERE chatId = '${chatId}';`;
				await db.queryDb(deleteChat);
				res.status(200).json({ message: "Deleted chat" });
			} else {
				res.status(400).json({ message: "Cannot delete chat (unauthorized)." });
			}
		} catch (error) {
			console.error(error);
		}
	}
	static async getChat(req, res) {
		try {
			const { chatId } = req.params;

			// get all messages sorted on the timestamp, newest first
			const getMessages = `SELECT * FROM message WHERE chatId=${chatId} ORDER BY timeAndDate ASC;`;
			const messages = await db.queryDb(getMessages);
			res.status(200).json(messages);
		} catch (error) {
			console.error(error);
		}
	}

	static async joinChat(req, res) {
		try {
			const { chatId } = req.params;
			const { username } = req.user;

			const doesChatExist = await Chat.doesChatExist(chatId);
			if (doesChatExist === false) {
				res.status(400).json({ message: "Chat does not exist" });
				return;
			}

			const doesParticipate = await Chat.isInChat(username, chatId);
			if (doesParticipate) {
				return res.status(400).json({ message: "Already in chat" });
			} else {
				const insertParticipates = `INSERT INTO participates (chatId, acc) VALUES ('${chatId}', '${username}');`;
				await db.queryDb(insertParticipates);
				res.status(200).json({ message: "joined chat" });
			}
		} catch (error) {
			console.error(error);
		}
	}

	static async doesChatExist(chatId) {
		try {
			const doesChatExist = `SELECT * FROM chat WHERE chatId=${chatId};`;
			const rows = await db.queryDb(doesChatExist);
			const doesExist = rows.length > 0;
			return doesExist;
		} catch (error) {
			console.error(error);
		}
	}

	static async leaveChat(req, res) {
		try {
			const { chatId } = req.params;
			const { username } = req.user;
			const doesParticipate = await Chat.isInChat(username, chatId);

			if (doesParticipate) {
				const deleteParticipates = `DELETE FROM participates WHERE chatId = ${chatId} AND acc = '${username}';`;
				await db.queryDb(deleteParticipates);
				res.status(200).json({ message: "left chat" });
			} else {
				res.status(400).json({ message: "Already not in chat." });
			}
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

	static async editMessage(req, res) {
		try {
			const { chatId, message } = req.body;
			const { account, contents, timeanddate, directedto } = message;
			console.log(chatId, account, contents, timeanddate, directedto);
			const directedToStr = directedto == null ? "NULL" : `'${directedto}'`;
			// const doesItExist = `SELECT * FROM message WHERE chatId=${chatId} AND account='${account}' and timeAndDate='${timeanddate}'::timestamptz;`;
			// const rows = await db.queryDb(doesItExist);
			const editMessage = `UPDATE message SET contents='${contents}', directedto=${directedToStr} WHERE chatId=${chatId} AND account='${account}' and timeAndDate='${timeanddate}'::timestamptz;`;
			const data = await db.queryDb(editMessage);
			res.status(200).json({ message: "Edited Message" });
		} catch (error) {
			console.error(error);
			res.status(400).json({ message: `Couldn't edit message -> ${error.detail}` });
		}
	}

	static async countChats(req, res) {
		try {
			const { countOption, countText } = req.body;
			const { username } = req.user;

			if (countOption == "user") {
				const getChats = `
				SELECT COUNT(*) AS count
				FROM chat c, participates p
				WHERE c.chatId = p.chatId
				AND c.chatId IN (
					SELECT chatId FROM participates WHERE acc='${countText}'
				)
				GROUP BY p.acc
				HAVING p.acc='${username}';`;

				const chats = await db.queryDb(getChats);
				res.status(200).json(chats);
			} else {
				res.status(400).json({ message: "Invalid filter option" });
			}
		} catch (error) {
			console.error(error);
			res.status(400).json({ message: "Error filtering chats" });
		}
	}

	static async deleteMessage(req, res) {}

	static async socketSendMessage(socket, chatId, message) {
		try {
			socket.broadcast.to(`chat_${chatId}`).emit("receive-message", message);
		} catch (error) {
			console.error(error);
		}
	}
	static async socketJoinChat(socket, chatId) {
		try {
			const { user } = socket;

			const doesParticipate = await Chat.isInChat(user.username, chatId);

			if (doesParticipate) {
				console.log(`joining chat: chat_${chatId}`);
				socket.join(`chat_${chatId}`);
				socket.emit("join-chat-success", { chatId });
				console.log("joined chat successfully: " + chatId);
			} else {
				socket.emit("join-chat-fail", { chatId });
			}
		} catch (error) {
			console.error(error);
		}
	}

	// static async socketLeaveChat(socket, chatId) {
	// 	socket.leave(`chat_${chatId}`);
	// 	socket.emit("leave-chat-success", { chatId });
	// 	// TODO: emit fail if they were not in the channel?
	// }

	static async isInChat(username, chatId) {
		const participatesInChat = `SELECT * FROM participates WHERE acc='${username}' AND chatId=${chatId};`;
		const rows = await db.queryDb(participatesInChat);
		const doesParticipate = rows.length > 0;
		return doesParticipate;
	}
}

module.exports = Chat;
