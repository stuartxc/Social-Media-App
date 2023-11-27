const { Pool } = require("pg")
const DatabaseInstance = require("../database/Database")
class Account {

  constructor() {
    this.db = DatabaseInstance.getInstance()
  }
  // create a new account
  static async create(req, res, next) {}

  // get an account
  static async get(req, res) {
    const id = req.params.userId
    console.log(id)
    try {
      const data = await this.db.queryDb(`SELECT * FROM test WHERE id=${id};`)
      
      res.json(data)
    } catch (error) {
      console.error(error)
      res.status(500).send("Server Error")
    }
  }

  // update an account
  static async update(req, res, next) {}
}
module.exports = Account
