const express = require('express')
const Post = require('../models/Post')
const router = express.Router()


router.get('/:category', async (req, res) => {
    try{
        const getCategory = await Post.find({category: req.params.category})
        res.status(200).json(getCategory)

    }
    catch(err) {
        res.status(404).json({message: err})
    }
})  





module.exports = router