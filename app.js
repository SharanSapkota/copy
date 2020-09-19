const express = require('express')
const bodyParser = require('body-parser');
const mongoose  = require('mongoose');
const app = express();
require('dotenv/config')

const postRoute = require('./routes/post')

app.use(bodyParser.json())
 app.use('/post', postRoute)

 

app.get('/', (req, res) => {
    res.send("this the main page")
})

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}, () => {
    console.log("DB connected")
});


app.listen(3000, () => {
    console.log("server started")
})