const express = require('express')
const router = express.Router()
const UserDetailModel = require('../models/UserDetails')
const updateCredits = require('../controllers/updateCredits')


router.patch('/:userId', async (req, res) => {
    const {creditAmount} = req.body;
    await UserDetailModel.findOne({_id: req.params.userId})
    .then(user => {
        const updatedCredits = updateCredits(user.credits, creditAmount, "+");
        // const updateCredits = updateCredits(user.credits, creditAmount, "-");
        
        console.log(updatedCredits)
        res.end();
    })
})

module.exports = router

