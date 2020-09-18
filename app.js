const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv/config')
const bodyParser = require('body-parser')
const postRoute = require('./routes/post')


app.use(bodyParser.json())
app.use(postRoute)

app.get('/', (req, res) => {
    res.send("This is the main page")
})

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log("DB connected")
});

app.listen(3000, () => {
    console.log("Server Started")
})