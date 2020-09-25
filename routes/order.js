const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    res.send('I am in order.js')
})


router.get('/cancelorder', (req, res) => {
    res.send('I am in cancel order.js')
})


module.exports = router
