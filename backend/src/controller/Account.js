const { Pool } = require("pg")
const DatabaseInstance = require("../database/Database")
const db = DatabaseInstance.getInstance()
class Account {

  // create a new account
  static async create(req, res, next) {}

  // get an account
  static async get(req, res) {
    const id = req.params.userId
    console.log(id)
    try {
      const data = await db.queryDb(`SELECT * FROM account WHERE username='${id}';`)
      
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
