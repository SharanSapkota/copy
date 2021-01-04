const { LexModelBuildingService } = require('aws-sdk')
const Users = require('../models/Users')

const getAllSellers = async() => {
     const getAllSeller = await Users.find()
     console.log(getAllSeller)
     return getAllSeller
}

module.exports = {getAllSellers}