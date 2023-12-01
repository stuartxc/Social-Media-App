"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, createContext, useContext } from "react";
import io from "socket.io-client";

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const socketContext = createContext(null);

const SocketProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const { user } = useAuth();
	useEffect(() => {
		if (user) {
			if (socket && socket.connected) {
				socket.disconnect();
			}
			const newSocket = io(SOCKET_SERVER_URL, {
				auth: {
					token: localStorage.getItem("token"),
				},
			});
			setSocket(newSocket);

			return () => newSocket.close();
		}
	}, [user]);

	return <socketContext.Provider value={{ socket }}>{children}</socketContext.Provider>;
};

const useSocket = () => useContext(socketContext);

export { SocketProvider, useSocket };
