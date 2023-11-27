const { Pool } = require("pg")
const DatabaseInstance = require("../database/Database")
class Account {
  // create a new account
  static async create(req, res, next) {}

  // get an account
  static async get(req, res) {
    const db = DatabaseInstance.getInstance()
    const id = req.params.userId
    console.log(id)
    try {
      const data = await db.queryDb(`SELECT * FROM test WHERE id=${id};`)
      
      res.json(data)
    } catch (error) {
      console.error(error)
      res.status(500).send("Server Error")
    }
  }

  // static async queryDb(queryText) {
  //   const pool = new Pool({
  //     user: process.env.DB_USER,
  //     host: process.env.DB_HOST,
  //     database: process.env.DB_NAME,
  //     port: process.env.DB_PORT,
  //   })
  //   const client = await pool.connect()
  //   try {
  //     const res = await this.client.query(queryText)
  //     return res.rows
  //   } finally {
  //     client.release()
  //   }
  // }

  static async getTest(req, res) {
    // // const db = DatabaseInstance.getInstance()
    // // const id = req.params.userId
    // try {
    //   const data = await this.queryDb(`SELECT * FROM test;`)
    //   res.json(data)
    // } catch (error) {
    //   console.error(error)
    //   res.status(500).send("Server Error")
    // }
  }

  // update an account
  static async update(req, res, next) {}
}
module.exports = Account
