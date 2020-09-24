
const userDetailsModel = require('../models/UserDetails')
const userModel = require('../models/Users')
const partnerModel = require('../models/Partners')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv/config')
// const router = require('../routes/login')
// const express = require('express')
// const router = express.Router()


const registerSeller = (req, res, next) => {
  
    bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
        if(err) {
            res.json({ error: err})
        }

        let userRefId = "";

        let user = new userModel ({
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

            let userDetails = new userDetailsModel({
                _id : user._id,
                username: user.username,
                phone_number: user.phone_number,
                email: user.email,
                role: 1,   
                fullname: req.body.fullname,
                address: req.body.address,
                credits: req.body.credits,
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
            res.json({ err: "err while hasing"})
        }
        

        var user = new userDetailsModel ({
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
            
                message: "User added successfully"
            })
        })
        .catch(error => {
            res.json({
                message: error
            })
        })
        console.log(user.password)

    })


}


const login = async (req, res) => {
    console.log(req.body)
    var username = req.body.username,
     password1 = req.body.password

     await userModel.findOne({$or: [{email: username}, {username:username}]})
    .then(user => {
        console.log(user)
        if(user){
            
          bcrypt.compare(password1, user.password, function(err, result) {
            
                if(err) {
                    console.log(err)
                    res.json({ err: "error in bcrypt compare"})
                }   

                if(result) {
                    let token = jwt.sign({id1: user._id},process.env.SECRET_KEY,{expiresIn: '4h'})
                    console.log(token)
                    res.json({
                        message: "login successfully",
                        
                        token,
                        username
                        
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


const loginPartner = async (req, res) => {
    try{ 
    // const usernamePartner = req.body.username
    // const passwordPartner = req.body.password
    
    const data = await partnerModel.findOne({username: req.body.username})
    console.log(data)
    if(data.username == req.body.username && data.password == req.body.password){
        res.status(200).json({ username: data.username, brand_name: data.brand_name})
    }
        
    }
    catch(err) {
        res.json({ error: err})
    }
       
    
}
  






// router.post('/login', (req, res) => {
//     try{
//         var username = req.body.username,
//         password = req.body.password
//         console.log(username)

//         const savedpwd = userDetailsModel.findOne({$or: [{email: username}, {username:username}]})
//         console.log(savedpwd)
//     }
//     catch(err) {
//         res.json({message: err})
//     }
// })





module.exports = {
    registerSeller,
    registerBuyer,
    login,
    loginPartner
}