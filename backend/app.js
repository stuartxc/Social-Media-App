const Server = require("./src/rest/Server");
require("dotenv").config();
const PORT = 3000;

const server = new Server(PORT);

server.start();
