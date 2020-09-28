const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    res.send('I am in review')
})




module.exports = router
