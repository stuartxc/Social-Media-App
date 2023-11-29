"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { decodeToken } from "@/util/authenticationUtil";

// Custom auth context
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	const logout = () => {
		localStorage.removeItem("token");
		setUser(null);
	};

	const login = (token) => {
		localStorage.setItem("token", token);
		setUser(decodeToken(token));
	};

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token != null) {
			const decodedToken = decodeToken(token);

			const didTokenExpire = Date.now() >= decodedToken.exp * 1000;
			if (didTokenExpire) {
				logout();
			} else {
				setUser(decodedToken);
			}
		}
	}, []);

	return <AuthContext.Provider value={{ user, logout, login }}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
