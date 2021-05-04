// ENVIRONMENT VARIABLES
const dotenv = require('dotenv')
dotenv.config()
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_PORT = process.env.DB_PORT
const ENV = process.env.NODE_ENV

// POSTGRES DB CONNECTION
const {Pool, Client} = require('pg')
const db = ENV === 'development'
    ? new Client(`postgresql://${DB_USERNAME}:${DB_PASSWORD}@localhost:${DB_PORT}/json`)
    : new Client("postgres://kajqcyfe:FFH1iEoAosl6W3NeDiWplCv4hVOtEhNj@rosie.db.elephantsql.com:5432/kajqcyfe")

db.connect()

module.exports = {
  dbConnection: db
}
