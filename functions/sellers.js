const { LexModelBuildingService } = require('aws-sdk')
const Users = require('../models/Users')

const getAllSellers = async() => {
     const getAllSeller = await Users.find({role : {$in: ["1", "2"]}})
     
     return getAllSeller
}

module.exports = {getAllSellers}