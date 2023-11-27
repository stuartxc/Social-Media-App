const express = require("express")
const app = express()
const PORT = 3000

require("dotenv").config()
const { Pool } = require("pg")

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
})

const queryDatabase = async (queryText) => {
  const client = await pool.connect()
  try {
    const res = await client.query(queryText)
    return res.rows
  } finally {
    client.release()
  }
}

app.get("/", (req, res) => {
  res.send("Hello!")
})

app.get("/data", async (req, res) => {
  try {
    const data = await queryDatabase("SELECT * FROM test;") 
    res.json(data)
  } catch (error) {
    console.error(error)
    res.status(500).send("Server Error")
  }
})

app.get("/testing", async (req, res) => {
  res.send("ERROR")
})

app.get("/testing2", (req, res) => {
  res.send("testing2323232!")
})
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`)
})
