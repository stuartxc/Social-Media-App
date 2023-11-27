class Account {
  // create a new account
  static async create(req, res, next) {}

  async queryDatabase(queryText) {
    const client = await pool.connect()
    try {
      const res = await client.query(queryText)
      return res.rows
    } finally {
      client.release()
    }
  }

  // get an account
  static async get(req, res) {
    try {
      const data = await this.queryDatabase("SELECT * FROM test;")
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
