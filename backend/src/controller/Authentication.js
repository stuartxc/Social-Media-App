class Authentication {
    static async login(req, res) {
        console.log(req.body);
        res.status(400).send("nahh");
    }

    static async logout(req, res) {}
}

module.exports = Authentication;
