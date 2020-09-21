
const signupModel = require('../models/UserDetails')
const signupModelUser = require('../models/Users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const registerSeller = (req, res, next) => {
    console.log("error")
    bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
        if(err) {
            res.json({ error: err})
        }

        let userRefId = "";

        let user = new signupModelUser ({
            username: req.body.username,
            password: hashedPass, 
            phone_number: req.body.phone_number,
            email: req.body.email,
            role: 1     
        })

        
    
        user.save()
        .then(user => {
            // userRefId = user._id;
            // res.json({
                
            //     message: "User added successfully"
            // })

            let userDetails = new signupModel({
                _id : user._id,
                username: user.username,
                phone_number: user.phone_number,
                email: user.email,
                role: 1,   
                fullname: req.body.fullname,
                address: req.body.address,
                dob: req.body.dob,
                bank_details: {
                    bank_name: req.body.bank_details.bank_name,
                    branch: req.body.bank_details.branch,
                    account_holder_name: req.body.bank_details.account_holder_name,
                    account_number: req.body.bank_details.account_number
                }
                
            })

            userDetails.save(userDetails);
            res.json({message: 'user added'})
        })
        .catch(error => {
            res.json({
                message: error
            })
        })

    })


}
const registerBuyer = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
        if(err) {
            res.json({ error: err})
        }

        let user = new signupModel ({
            fullname: req.body.fullname,
            username: req.body.username,
            password: hashedPass, 
            phone_number: req.body.phone_number,
            email: req.body.email,
            address: req.body.address,
            dob: req.body.dob
        })
    
        user.save()
        .then(user => {
            res.json({
                data: user,
                message: "User added successfully"
            })
        })
        .catch(error => {
            res.json({
                message: error
            })
        })

    })


}


const login = (req, res) => {
    var username = req.body.username,
    password = req.body.password

    signupModel.findOne({$or: [{email: username}, {username:username}]})
    .then(user => {
        if(user){
            bcrypt.compare(password, user.password, function(err, result) {
                if(err) {
                    res.json({ err: "error"})
                }

                if(result) {
                    let token = jwt.sign({name: user.username},'secretvalue',{expiresIn: '1h'})
                    res.json({
                        message: "login successfully",
                        token
                    })

                }
                else{
                    res.json({message: "password does not match"})
                }
            })
        }
        else{
            res.json({
               message: "no users found"
            })
        }
    })


}



module.exports = {
    registerSeller,
    registerBuyer,
    login
}