const express = require('express')
const app = express()
const cors = require('cors')
const db = require('./db.js').dbConnection
const port = process.env.PORT

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send("JSON backend")
})

app.get('/new', async (req, res) => {
    let api_key = new Array(3).fill(0).map(i => {
        return Math.round(Math.random()) ? String.fromCharCode(Math.round(Math.random() * 25) + 97) : Math.round(Math.random() * 9)
    }).join('')

    const insertQuery = {
        text: `INSERT INTO json(api_key) VALUES($1) RETURNING *`,
        values: [api_key],
    }

    try {
        const data = await db.query(insertQuery);
        res.status(200).send({"success": true, "data": data.rows[0].api_key})
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error -- We had a problem with our server. Try again later.")
    }
})

app.get('/user/:api_key', async (req, res) => {
    const api_key = req.params.api_key

    const selectQuery = {
        text: `SELECT * FROM json WHERE user_id = $1`,
        values: [api_key],
    }

    try {
        const data = await db.query(selectQuery)
        if (data.rows.length) {
            res.status(200).send({"success": true, "data": JSON.parse(data.rows[0].json)})
        }
        else {
            res.status(401).send("Unauthorized - Your API key is wrong.")
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send("Internal Server Error -- We had a problem with our server. Try again later.")
    }
})

app.post('/user/:api_key', async (req, res) => {
    const api_key = req.params.api_key
    const {json} = req.body

    const selectQuery = {
        text: `SELECT 1 FROM json WHERE user_id = $1`,
        values: [api_key],
    }
    const updateQuery = {
        text: `UPDATE json SET json = $1 WHERE user_id = $2 RETURNING json`,
        values: [json, api_key],
    }

    try {
        const idCheck = await db.query(selectQuery)
        if (idCheck.rows.length) {
            const data = await db.query(updateQuery)
            res.status(200).send({"success": true, "data": JSON.parse(data.rows[0].json)})
        }
        else {
            res.status(401).send("Unauthorized - Your API key is wrong.")
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send("Internal Server Error -- We had a problem with our server. Try again later.")
    }
})

// add new id row
// insert into row
//


app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})
