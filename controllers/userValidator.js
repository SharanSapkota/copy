const { check, validationResult } = require('express-validator')

exports.userValidationResult =(req, res, next) => {
    const result = validationResult(req)
    console.log(result)
    if(!result.isEmpty()) {
        console.log("erro")
        const error = result.array()[0].msg;
        return res.status(400).json({success: false, error: error})
    }
    next()
}


exports.userValidator = [
    check('fullname')
    .trim()
    .not()
    .isEmpty()
    .withMessage('fullname is required')
    .isLength({min: 5})
    .withMessage('Fullname is too short '),
    
    check('username')
    .trim()
    .not()
    .isEmpty()
    .withMessage('username is required')
    .isLength({min: 5})
    .withMessage('username is too short'),

    check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('password is required')
    .isLength({min: 5})
    .withMessage('Password too short'),

    check('email')
    .trim()
    .not()
    .isEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),

    check('phone_number')
    .trim()
    .not()
    .isEmpty()
    .withMessage('email is required'),

    check('dob')
    .trim()
    .not()
    .isEmpty()
    .withMessage('dob is required'),
   
]