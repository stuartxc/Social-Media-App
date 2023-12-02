"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const Navbar = () => {
	const [searchQuery, setSearchQuery] = useState("");

	const { user, logout } = useAuth();
	const router = useRouter();
	if (user) {
		console.log("Logged in with token: " + user["token"]);
	}

	const handleLogout = () => {
		logout();
		router.push("/");
	};

	return (
		<div className="bg-gray-800 text-white p-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<a href="/" className="hover:text-gray-300">
						Home
					</a>

					{user && (
						<a href="/chat" className="hover:text-gray-300">
							Chat
						</a>
					)}

					<a href="/dev" className="hover:text-gray-300">
						Dev
					</a>
				</div>
				<div className="flex items-center space-x-4 justify-center flex-1">
					<a href="/post" className="hover:text-gray-300">
						Post
					</a>
					<div className="relative">
						<input
							type="text"
							placeholder="Search"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="rounded p-1 text-black"
						/>
						<button
							onClick={() => {}}
							className="absolute right-0 top-0 mt-1 mr-1"
						></button>
					</div>
				</div>
				<div className="flex items-center space-x-4 justify-end">
					{user ? (
						<button onClick={handleLogout} className="hover:text-gray-300">
							Logout
						</button>
					) : (
						<a href="/register" className="hover:text-gray-300">
							Register
						</a>
					)}

					<a href={user ? `/user/${user.username}` : "/authentication"} className="hover:text-gray-300">
						{user ? "Profile" : "Login"}
					</a>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
