const express = require('express');
const multer = require('multer')
const path = require('path')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

const upload = multer({
    destination: './upload/f-img',
    filename: (req, file, cb) => {
        return cb(null, `${req.file.fieldname}_${Date.now()}${path.extname(req.file.originalname)}`)
    }
})

app.post('/upload', upload.single('profile'), (req, res) => {
    console.log(req.file)
})

app.listen(3000, () => {
    console.log("stated")
})