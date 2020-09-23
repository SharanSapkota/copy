const express = require('express')
const router = express.Router()




router.post('/login', (req, res) => {
    try{
        var username = req.body.username,
        password = req.body.password
        console.log(username)

        const savedpwd = signupModel.findOne({$or: [{email: username}, {username:username}]})
        console.log(savedpwd)
    }
    catch(err) {
        res.json({message: err})
    }
})