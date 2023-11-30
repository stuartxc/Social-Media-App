"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const ChatAPI = `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`;

const ChatPage = ({ params }) => {
	const { chatid } = params;

	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const { user } = useAuth();

	const router = useRouter();

	const handleBack = () => {
		router.push("/chat");
	};

	const handleSendMessage = () => {
		const messageData = {
			tempid: messages.length, // Temporary id for the message to handle timeanddate updating
			account: user.username,
			contents: message,
			timeanddate: "idk yet",
		};

		setMessages([...messages, messageData]);
		setMessage("");

		const data = fetch(`${ChatAPI}/message`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			body: JSON.stringify({ chatId: chatid, message: message }),
		});
		data.then((response) => {
			if (response.ok) {
				return response.json();
			}
			return Promise.reject(response);
		})
			.then((result) => {
				console.log(result);
				setMessages((prevMessages) => {
					const updatedMessages = [...prevMessages];
					return updatedMessages.map((msg) => {
						if (msg.tempid && msg.tempid === messageData.tempid) {
							return {
								...msg,
								timeanddate: result.timeanddate,
							};
						} else {
							return msg;
						}
					});
				});
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			handleSendMessage();
		}
	};

	useEffect(() => {
		// if (!user) {
		// 	router.push("/login");
		// } I do not know why refreshing the page causes the user to be null briefly, which routes back to login

		const allMessages = fetch(`${ChatAPI}/${chatid}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		});
		allMessages
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				return Promise.reject(response);
			})
			.then((result) => {
				console.log(result);
				setMessages(result);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	return (
		<div className="justify-center flex w-100">
			<div className="w-2/3 max-h-screen bg-white shadow-lg flex flex-col">
				<div className="p-4 border-b border-gray-200 flex items-center justify-between">
					<button onClick={handleBack} className="hover:text-red-600">
						←
					</button>
					<h2 className="text-xl font-semibold">Chat</h2>
					<button className="hover:text-red-600">Leave</button>
				</div>
				<div className="flex-grow overflow-y-auto">
					{messages.map((msg, index) => (
						<div key={index} className="border-gray-200 p-4 border-b ">
							<span className="font-semibold">{msg.account}</span>{" "}
							<span className="text-sm text-gray-600">{msg.timeanddate}</span>
							<p>{msg.contents}</p>
						</div>
					))}
				</div>
				<div className="p-4 border-t border-gray-200 flex">
					<input
						type="text"
						className="flex-grow p-2 border border-gray-300 rounded mr-2"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyDown={handleKeyDown}
					/>
					<button
						onClick={handleSendMessage}
						className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
					>
						Send
					</button>
				</div>
			</div>
		</div>
	);
};

export default ChatPage;
