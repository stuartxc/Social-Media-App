"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ChatPage = ({ params }) => {
	const { chatid } = params;

	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);

	const router = useRouter();

	const handleBack = () => {
		router.push("/chat");
	};

	const handleSendMessage = () => {
		const messageData = {
			username: "asdfdsafsda",
			text: message,
		};
		setMessages([...messages, messageData]);
		setMessage("");

		// Send message to server
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			handleSendMessage();
		}
	};

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
							<span className="font-semibold">{msg.username}</span>{" "}
							<span className="text-sm text-gray-600">{msg.timestamp}</span>
							<p>{msg.text}</p>
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
