const express = require('express');
const router = express.Router()
const Post = require('../models/Post')


// GET ALL
router.get('/post', async (req, res) => {
  try {
     const posts = await Post.find();
    res.json(posts)

  } catch(err) {
      res.json({ message: err})
  }


})


//POST
router.post('/post', async (req, res) => {
    const post = new Post({
        listing_name: req.body.listing_name,
        listing_type: req.body.listing_type,
        occassion: req.body.occassion,
        gender: req.body.gender,
        design: req.body.design,
        feature: req.body.feature,  
        purchase_price: req.body.purchase_price,
        selling_price: req.body.selling_price,
        commission: req.body.commission,
        platform_fee: req.body.platform_fee,
        purchase_date: req.body.purchase_date,
        condition: req.body.condition,
        likes: req.body.likes,
        measurement: req.body.measurement,
        fabric: req.body.fabric,
        color: req.body.color,
        status: req.body.status
    })
    
try{
    const savedPost = await post.save();
    res.json(savedPost)
} catch(err) {
    res.json({ message: err })
}

})

// GET BY ID
router.get('/post/:postId', async (req, res) => {
   try {  
    const post = await Post.findById(req.params.postId)
    res.json(post)
}
   catch {
    res.json({message: err})
   }
})

// DELETE BY ID
router.delete('/post/:postId', async (req, res) => {
    try{
        
    const deletePost = await Post.remove ({_id: req.params.postId})
        res.json(deletePost)
}
    catch(err){
        res.json({message: err})
    }
})


//UPDATE BY ID
router.patch('/post/:postId', async(req, res) => {
    try{
        const updatedPost = await Post.updateMany({_id: req.params.postId}, 
            { $set:{ listing_name: req.body.listing_name,
                 listing_type: req.body.listing_type,
                 occassion: req.body.occassion,
                 gender: req.body.gender,
                 design: req.body.design,
                 feature: req.body.feature,  
                 purchase_price: req.body.purchase_price,
                 selling_price: req.body.selling_price,
                 commission: req.body.commission,
                 platform_fee: req.body.platform_fee,
                 purchase_date: req.body.purchase_date,
                 condition: req.body.condition,
                 likes: req.body.likes,
                 measurement: req.body.measurement,
                 fabric: req.body.fabric,
                 color: req.body.color,
                 status: req.body.status
                } })
            res.send(updatedPost)
    } catch(err){
         res.json({ message: "err"})
    }
})

module.exports = router