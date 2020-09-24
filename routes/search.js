const express = require('express');
const router = express.Router()
const Post = require('../models/Post')


router.get('/:search1', async (req, res) => {

    const search = await Post.find({listing_name: req.body.listing_name})
    res.json(search)

    
})
module.exports = router