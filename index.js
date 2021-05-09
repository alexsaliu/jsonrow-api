const express = require('express')
const app = express()
const cors = require('cors')
const db = require('./db.js').dbConnection
const port = process.env.PORT

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    const ip = req.connection.remoteAddress
    res.send("JSON backend" + ip)
})

app.get('/new', async (req, res) => {
    let api_key = new Array(30).fill(0).map(i => {
        return Math.round(Math.random()) ? String.fromCharCode(Math.round(Math.random() * 25) + 97) : Math.round(Math.random() * 9)
    }).join('')

    const insertQuery = {
        text: `INSERT INTO json(api_key) VALUES($1) RETURNING *`,
        values: [api_key],
    }

    try {
        const data = await db.query(insertQuery);
        res.status(200).send({"api_key": data.rows[0].api_key})
    }
    catch (err) {
        console.log(err);
        res.status(500).send("500 Internal Server Error -- Please Try again later")
    }
})

app.get('/user/:api_key', async (req, res) => {
    const api_key = req.params.api_key
    console.log("OK");

    const selectQuery = {
        text: `SELECT * FROM json WHERE api_key = $1`,
        values: [api_key],
    }

    try {
        const data = await db.query(selectQuery)
        if (data.rows.length) {
            res.status(200).send({"json": JSON.parse(data.rows[0].json)})
        }
        else {
            res.status(401).send("401 Unauthorized - Your API key is wrong")
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send("500 Internal Server Error -- Please Try again later")
    }
})

app.post('/user/:api_key', async (req, res) => {
    const api_key = req.params.api_key
    const {json} = req.body
    console.log(json)

    const selectQuery = {
        text: `SELECT 1 FROM json WHERE api_key = $1`,
        values: [api_key],
    }
    const updateQuery = {
        text: `UPDATE json SET json = $1 WHERE api_key = $2 RETURNING json`,
        values: [json, api_key],
    }

    try {
        const idCheck = await db.query(selectQuery)
        if (idCheck.rows.length) {
            const data = await db.query(updateQuery)
            res.status(200).send({"json": JSON.parse(data.rows[0].json)})
        }
        else {
            res.status(401).send("401 Unauthorized - Your API key is wrong")
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send("500 Internal Server Error -- Please Try again later")
    }
})

// add new id row
// insert into row
//


app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})
