const express = require('express')
const bodyParser = require('body-parser');
const mongoose  = require('mongoose');
const app = express();
require('dotenv/config')
const AuthController = require('./routes/auth')
const loginController = require('./routes/login')
const multer = require('multer')
var upload = multer();
const cors = require('cors')

const postRoute = require('./routes/post')
const profileRoute = require('./routes/profile')
const creditsRoute = require('./routes/credit')

// const loginRouter = require('./controllers/authController')

app.use(bodyParser.json())



app.use(upload.array())

app.use('/post', postRoute)
app.use('/profile', profileRoute)
app.use('/credits', creditsRoute)
app.use( AuthController )
app.use(cors())

// app.use(loginRouter)

 

app.get('/', (req, res) => {
    res.send("this the main page")
})

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}, () => {
    console.log("DB connected")
});


app.listen(3000, () => {
    console.log("server started")
})