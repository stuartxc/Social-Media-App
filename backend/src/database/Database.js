const { Pool } = require("pg")
require("dotenv").config()

class DatabaseInstance {
  static instance = null
  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    })
  }

  static getInstance() {
    if (!DatabaseInstance.instance) {
      DatabaseInstance.instance = new DatabaseInstance()
    }
    return DatabaseInstance.instance
  }
}

module.exports = DatabaseInstance
