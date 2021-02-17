const express = require('express')
const Users = require('../models/Users')
const functions = require('../functions/sellers')
const {getUserDetails} = require ('../functions/users')
const AuthController = require("../controllers/authController");

const router = express.Router();

router.get("/", AuthController.authAdmin, async (req, res) => {
  try {
    const getAllSellers = await functions.getAllSellers();
    console.log(getAllSellers);

    res.status(200).json(getAllSellers);
  } catch (err) {
    res.status(404).json(err);
  }
});

})

router.get('/seller/:id', async (req, res) => {
   console.log(req.params.id)
    try {
        const getSeller = await getUserDetails({user: req.params.id})
        res.status(200).json({success: true, getSeller})
       


    } catch(err) {
        console.log(err)
    }
})

module.exports = router;
