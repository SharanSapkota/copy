const express = require('express');
const Evaluation = require('../../models/admin/Evaluation')

const router = express.Router();

// Get All Evaluation
router.get('/', async(req, res) => {
  
   try{
    const getAllEvaluation = await Evaluation.find()
    res.status(200).json(getAllEvaluation)
   }
   catch (err) {
       res.status(404).json(err)
   }
})

// Post Evaluation

router.post('/', async(req, res) => {

    const {
        seller,
        listing_type,
        color,
        detail,
        purchase_price,
        recondition
     
    } = req.body


    const evaluationDestructure = {}

    if(seller){
        evaluationDestructure.seller = req.body.seller
    }
    if(listing_type){
        evaluationDestructure.listing_type = req.body.listing_type
    }
    if(color){
        evaluationDestructure.color = req.body.color
    }
    if(detail){
        evaluationDestructure.detail = req.body.detail
    }
    if(purchase_price){
        evaluationDestructure.purchase_price = req.body.purchase_price
    }
    if(recondition){
        evaluationDestructure.recondition = req.body.recondition
    }

    const postEvaluation = new Evaluation(evaluationDestructure)

    

    try {
        await postEvaluation.save()
        res.status(200).json({success: true})
        console.log(postEvaluation)
        
    }
    catch( err) {
        res.status(404).json({message: err})
    }
})


//Get By Id
router.get('/:evaluationId', async (req, res) => {

    try{
        const getById = await Evaluation.findById({_id: req.params.evaluationId})
        res.status(200).json(getById)
    }

    catch(err) {
        res.status(500).json({message: err})
    }

})


// Update Evaluation

router.patch('/:evaluationId', async(req, res) => {
    console.log("heree")
    const {
        seller,
        listing_type,
        color,
        detail,
        purchase_price,
        status
        
    } = req.body

    const evaluationDestructure = {}

    if(seller){
        evaluationDestructure.seller = req.body.seller
    }
    if(listing_type){
        evaluationDestructure.listing_type = req.body.listing_type
    }
    if(color){
        evaluationDestructure.color = req.body.color
    }
    if(detail){
        evaluationDestructure.detail = req.body.detail
    }
    if(purchase_price){
        evaluationDestructure.purchase_price = req.body.purchase_price
    }
    if(status){
        evaluationDestructure.status = req.body.status
    }

try{
    const patchAll = await Evaluation.findOneAndUpdate({_id: req.params.evaluationId},{$set: evaluationDestructure})
        res.status(200).json(patchAll)
} catch(err){
    res.status(404).json({ message: err })
}


})


//Delete 

router.delete('/:evaluationId', async (req, res) => {
    
    try{
    const deleteEvaluation = await Evaluation.findById({_id: req.params.evaluationId})
    deleteEvaluation.remove()
    res.status(200).json({success: true})
    }

    catch(err){
        res.status(200).json({ message: err})
    }
})



module.exports = router;