"use client";

const Chat = ({ chat, idx }) => {
	const handleClick = () => {
		console.log("hi");
	};
	return (
		<li key={idx} className="border-b border-gray-200 p-4 hover:bg-gray-100">
			<button className="w-full text-lg focus:outline-none text-left" onClick={handleClick}>
				<div className="text-lg">{chat.name}</div>
				<div className="text-sm text-gray-600">Something, test test</div>
			</button>
		</li>
	);
};

const AddChat = () => {
	const handleClick = () => {
		console.log("hi");
	};

	return (
		<li className="border-b border-gray-200 hover:bg-gray-100">
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

const ChatMenu = ({ chats }) => {
	chats = [{ name: "hi" }];
	return (
		<div className="flex justify-center w-100 p-4">
			<div className="max-h-screen overflow-y-auto bg-white shadow-lg w-2/3 border rounded">
				<div className="p-4 border-b border-gray-200">
					<h2 className="text-xl font-semibold">Chats</h2>
				</div>
				<ul>
					{chats && chats.map((chat, idx) => <Chat chat={chat} idx={idx} />)}
					<AddChat />
				</ul>
			</div>
		</div>
	);
};

export { ChatMenu };
