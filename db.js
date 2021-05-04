// ENVIRONMENT VARIABLES
const dotenv = require('dotenv')
dotenv.config()
const env = process.env.NODE_ENV
const local_db = process.env.LOCAL_DB
const live_db = "postgres://kajqcyfe:FFH1iEoAosl6W3NeDiWplCv4hVOtEhNj@rosie.db.elephantsql.com:5432/kajqcyfe"

// POSTGRES DB CONNECTION
const dbConnection = env === 'development' ? local_db : live_db
const {Pool, Client} = require('pg')
const db = new Client(dbConnection)

db.connect()

module.exports = {
  dbConnection: db
}
