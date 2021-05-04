// ENVIRONMENT VARIABLES
const dotenv = require('dotenv')
dotenv.config()
const env = process.env.NODE_ENV
const local_db = process.env.LOCAL_DB
const live_db = process.env.LIVE_DB

// POSTGRES DB CONNECTION
const dbConnection = env === 'development' ? local_db : live_db
const {Pool, Client} = require('pg')
const db = new Client(dbConnection)

db.connect()

module.exports = {
  dbConnection: db
}
