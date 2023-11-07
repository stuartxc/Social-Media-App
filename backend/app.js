const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.send("Hello!");
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});
