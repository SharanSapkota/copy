const express = require('express')

const router = express.Router()

router.get('/likes', (req, res) => {
    res.send('I am in likes product')
})


router.get('/dislikes', (req, res) => {
    res.send('I am in dislike product')
})


module.exports = router
