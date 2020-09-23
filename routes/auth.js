const express = require('express')

const router = express.Router()

const AuthController = require('../controllers/authController')
const {userValidator, userValidationResult} = require('../controllers/userValidator')

router.post('/register/seller',userValidator, userValidationResult, AuthController.registerSeller)
router.post('/register/buyer', userValidator, userValidationResult, AuthController.registerBuyer)
router.post('/login', AuthController.login)



module.exports = router