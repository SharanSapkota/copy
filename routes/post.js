const express = require('express')

const router = express.Router()
const Post = require('../models/Post')


//GET ALL
router.get('/', async(req, res) => {
    try{
    const getAll = await Post.find()
    res.json(getAll)
}
catch(err){
    res.json({ message: err})
}
})


// POST
router.post('/', async (req, res) => {
    
    const posts = new Post({
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

    const savedPost = await posts.save()
  
   res.json(savedPost)
}
catch {
    res.json({message: err})
}
})


//GET BY ID
router.get('/:postId', async (req, res) => {
    try{ 
     const posts = await Post.findById(req.params.postId)
    res.json(posts)
    } 
    catch(error) {
        res.jsaon({message: error})
    }
})



//DELETE
router.delete('/:postId',async (req, res) => {
    try{
        const removedPosts = await Post.remove({_id: req.params.postId})
        res.json(removedPosts)
    }
    catch(error) {
        res.jsaon({message: error})
    }
})




//UPDATE
router.patch('/:postId', async(req, res) => {
    try{
        const  {
        listing_name,
        listing_type,
        occassion,
        gender,
        design, 
        feature, 
        purchase_price, 
                
        selling_price, 
        commission, 
        platform_fee, 
        purchase_date, 
        condition, 
        likes, 
        measurement, 
        fabric, 
         color, 
        status
         } = req.body

         const update = {}
            
         if (listing_name) {
             update.listing_name = req.body.listing_name 
            
         }
         if (listing_type) {
             update.listing_type = req.body.listing_type 
            
         }
         if (occassion) {
             update.occasion = req.body.occasion
            
         }
         if (gender) {
             update.gender = req.body.gender 
            
         }
         if (design) {
             update.design = req.body.design 
            
         }
         if (feature) {
             update.feature = req.body.feature 
            
         }
         if (purchase_price) {
             update.purchase_price = req.body.purchase_price 
            
         }
         if (selling_price) {
             update.selling_price = req.body.selling_price 
            
         }
         if (commission) {
             update.commission = req.body.commission 
            
         }
         if (platform_fee) {
             update.platform_fee = req.body.platform_fee 
            
         }
         if (purchase_date) {
             update.purchase_date = req.body.purchase_date 
            
         }
         if (likes) {
             update.likes = req.body.likes 
            
         }
         if (status) {
             update.status = req.body.status 
            
         }
         if (condition) {
             update.condition = req.body.condition 
            
         }
         if (measurement) {
             update.measurement = req.body.measurement 
            
         }
         if (fabric) {
             update.fabric = req.body.fabric 
            
         }
         if (color) {
             update.color = req.body.color 
            
         }
      

        const updatedPost = await Post.findOneAndUpdate(
            {_id: req.params.postId},
            
           { $set: update}
            )
            res.json(updatedPost)
         }
        catch (err) {
            res.json({message: err})
        }}
)

module.exports = router