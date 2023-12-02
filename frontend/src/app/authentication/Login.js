"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
// const BACKEND_URL = "http://localhost:3000";
const LOGIN_URL = `${BACKEND_URL}/login`;

const Login = () => {
	const [username, setUserName] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

	const router = useRouter();

	const { login } = useAuth();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrorMessage("");
		setIsLoading(true);

		if (!username || !password) {
			setErrorMessage("Username and password are required");
			setIsLoading(false);
			return;
		}

		try {
			const data = fetch(LOGIN_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: username,
					password: password,
				}),
			});

			data.then((response) => {
				if (response.ok) {
					return response.json();
				}
				return Promise.reject(response);
			})
				.then((result) => {
					console.log(result.token);
					login(result.token);
					setSuccessMessage("Login successful");

					setTimeout(() => {
						router.push("/");
					}, 1000);
				})
				.catch((err) => {
					setErrorMessage(err.statusText);
				});
		} catch (error) {
			setErrorMessage(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="mx-auto max-w-md p-6">
			<form className="flex flex-col space-y-4">
				<input
					type="text"
					placeholder="Username"
					className="px-4 py-2 border border-gray-300 rounded-md"
					value={username}
					onChange={(e) => setUserName(e.target.value)}
				/>
				<input
					type="password"
					placeholder="Password"
					className="px-4 py-2 border border-gray-300 rounded-md"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button
					type="submit"
					onClick={handleSubmit}
					className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
				>
					{isLoading ? "Loading..." : "Submit"}
				</button>
			</form>
			{errorMessage && <div className="text-red-500">{errorMessage}</div>}
			{successMessage && <div className="text-green-500">{successMessage}</div>}
		</div>
	);
};

export default Login;
