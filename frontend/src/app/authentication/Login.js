"use client";

import { useState, useEffect } from "react";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const LOGIN_URL = `${BACKEND_URL}/login`;

const Login = () => {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const tryLogin = async () => {
        const response = await fetch(LOGIN_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            return data;
        }

        throw new Error(data.message);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage("");
        setIsLoading(true);

        if (!username || !password) {
            setErrorMessage("Username and password are required");
            setIsLoading(false);
            return;
        }

        try {
            const data = tryLogin();
            console.log(data);
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
        </div>
    );
};

export default Login;
