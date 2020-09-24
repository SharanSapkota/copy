const express = require('express')

const router = express.Router()

const AuthController = require('../controllers/authController')
const {userValidator, userValidationResult} = require('../controllers/userValidator')

router.post('/register/seller',userValidator, userValidationResult, AuthController.registerSeller)
router.post('/register/buyer', AuthController.registerBuyer)
router.post('/login', AuthController.login)
router.get('/test', (req,res) => {
    res.send("text")
})
router.post('/loginPartner', AuthController.loginPartner)



module.exports = router