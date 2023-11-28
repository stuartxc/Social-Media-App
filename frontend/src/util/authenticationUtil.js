const decodeToken = (token) => {
	// Helped with https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
	return JSON.parse(atob(token.split(".")[1]));
};

export { decodeToken };
