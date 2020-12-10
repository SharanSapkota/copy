const express = require('express')
const Users = require('../models/Users')

const router = express.Router()

router.get('/', async (req, res) => {
    try{
    const getAllSellers = await Users.find()
   
    res.status(200).json(getAllSellers)
}catch(err) {
    res.status(404).json(err)

}

})

module.exports = router