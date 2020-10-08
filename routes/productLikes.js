const express = require('express');
const Post = require('../models/Post');
const router = express.Router();
const AuthController = require("../controllers/authController");

router.get('/like', async (req, res) => {
    res.json("I am in the like route")
})

router.put('/like/:postId', AuthController.authUser, async (req, res) => {

    try{
   const likesCount = await Post.findByIdAndUpdate(req.params.postId, 
    {$push: {likes: req.user._id}}, {new: true}
    )
res.status(200).json(likesCount)
}
catch(err) {
    res.json(err)
}

})

router.get('/unlike/:postId', AuthController.authUser, async (req, res) => {
    res.json("I am in the unlike route")
})


router.put('/unlike/:postId', async (req, res) => {
    try{
   const unlikesCount = await Post.findByIdAndUpdate(req.params.postId, 
    {$pull: {likes: req.user._id}}, {new: true}
    )
res.status(200).json(unlikesCount)
}
catch(err) {
    res.json(err)
}

})

module.exports = router