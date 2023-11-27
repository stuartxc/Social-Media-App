const { Pool } = require("pg")
require("dotenv").config()

class DatabaseInstance {
  static instance = null
  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT,
    })
  }

  static getInstance() {
    if (DatabaseInstance.instance == null) {
      DatabaseInstance.instance = new DatabaseInstance()
    }
    return DatabaseInstance.instance
  }

  async queryDb(queryText) {
    const client = await this.pool.connect()
    try {
        console.log(queryText)
      const res = await client.query(queryText)
      return res.rows
    } finally {
      client.release()
    }
  }
}

module.exports = DatabaseInstance
