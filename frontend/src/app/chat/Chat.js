"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ChatAPI = `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`;

const Chat = ({ chat, idx }) => {
	const { user } = useAuth();
	const router = useRouter();
	const handleClick = () => {
		if (!user) {
			console.error("User not logged in");
			return;
		}
		router.push(`/chat/${chat.chatid}`);
	};

	return (
		<li key={idx} className="border-b border-gray-200 p-4 hover:bg-gray-100">
			<button className="w-full text-lg focus:outline-none text-left" onClick={handleClick}>
				<div className="text-lg">
					<span className="text-gray-500">#{chat.chatid}</span>
				</div>
				<div className="text-sm text-gray-600">
					Participants: {chat.participants.map((name) => name.acc).join(", ")}
				</div>
			</button>
		</li>
	);
};

const AddChat = () => {
	const router = useRouter();

	const handleClick = () => {
		const data = fetch(`${ChatAPI}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		});
		data.then((response) => {
			if (response.ok) {
				return response.json();
			}
			return Promise.reject(response);
		})
			.then((result) => {
				console.log(result);
				router.push(`/chat/${result.chatId}`);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	return (
		<li key="create-chat" className="border-b border-gray-200 hover:bg-gray-100">
			<button
				className="w-full p-4 flex items-center text-lg focus:outline-none"
				onClick={handleClick}
			>
				<span className="text-green-600 align-middle mr-2 pb-0.5">⨁</span>
				<span>Create a new chat!</span>
			</button>
		</li>
	);
};

const JoinChat = () => {
	const router = useRouter();
	const handleClick = () => {
		// router.push(`/chat/join`);
		const chatId = prompt("Enter the chat ID");
		const data = fetch(`${ChatAPI}/join/${chatId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		});

		data.then((response) => {
			if (response.ok) {
				return response.json();
			}
			return Promise.reject(response);
		})
			.then((result) => {
				console.log(result);
				router.push(`/chat/${chatId}`);
			})
			.catch((error) => {
				console.error(error);
				alert("Error: " + error.statusText);
			});
	};

	return (
		<li key="join-chat" className="border-b border-gray-200 hover:bg-gray-100">
			<button
				className="w-full p-4 flex items-center text-lg focus:outline-none"
				onClick={handleClick}
			>
				<span className="text-grey-600 align-middle mr-2 pb-0.5">⨝</span>
				<span>Join a new chat!</span>
			</button>
		</li>
	);
};

const CountModal = ({ isOpen, onClose, onSubmit }) => {
	const [countOption, setCountOption] = useState("user");
	const [countText, setCountText] = useState("");

	const handleSubmit = () => {
		onSubmit({ countOption, countText });
		onClose();
	};

	if (isOpen === false) return null;

	return (
		<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
			<div className="bg-white p-4 rounded-lg">
				<h2 className="mb-4 text-xl font-semibold">Count By</h2>
				<div className="mb-4">
					<select
						className="p-2 border border-gray-300 rounded mr-2"
						value={countOption}
						onChange={(e) => setCountOption(e.target.value)}
					>
						<option value="username">Username</option>
					</select>
					<input
						type="text"
						className="p-2 border border-gray-300 rounded"
						value={countText}
						onChange={(e) => setCountText(e.target.value)}
					/>
				</div>
				<button
					className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-600 float-left"
					onClick={handleSubmit}
				>
					Submit
				</button>
				<button
					className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 float-right"
					onClick={onClose}
				>
					Close
				</button>
			</div>
		</div>
	);
};

const ChatMenu = () => {
	const [chats, setChats] = useState([]);
	const [isCountByOpen, setIsCountByOpen] = useState(false);

	const getChats = () => {
		const data = fetch(`${ChatAPI}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		});
		data.then((response) => {
			if (response.ok) {
				return response.json();
			}
			return Promise.reject(response);
		})
			.then((result) => {
				console.log(result);
				setChats(result);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const getNumberChats = (countOptions) => {
		const data = fetch(`${ChatAPI}/count`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			body: JSON.stringify(countOptions),
		});

		data.then((response) => {
			if (response.ok) {
				return response.json();
			}
			return Promise.reject(response);
		})
			.then((result) => {
				alert(
					`There are ${result[0].count} chats with ${countOptions.countOption}: ${countOptions.countText}`
				);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	useEffect(() => {
		getChats();
	}, []);

	return (
		<div className="flex justify-center w-100 p-4">
			<div className="max-h-screen overflow-y-auto bg-white shadow-lg w-2/3 border rounded">
				<div className="p-4 border-b border-gray-200 items-center grid grid-flow-col">
					<h2 className="text-xl font-semibold row-span-3">Chats</h2>
					<span>
						<button className="float-right" onClick={() => setIsCountByOpen(true)}>
							Count By
						</button>
					</span>
				</div>

				<ul>
					{chats && chats.map((chat, idx) => <Chat chat={chat} idx={idx} />)}
					<AddChat />
					<JoinChat />
				</ul>

				<CountModal
					isOpen={isCountByOpen}
					onSubmit={(countOptions) => {
						getNumberChats(countOptions);
					}}
					onClose={() => {
						setIsCountByOpen(false);
					}}
				/>
			</div>
		</div>
	);
};

export { ChatMenu };
