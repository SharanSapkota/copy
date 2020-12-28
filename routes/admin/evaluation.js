const express = require('express');
const Evaluation = require('../../models/admin/Evaluation')
const evalFunctions = require('./functions/evaluations')

const router = express.Router();

// Get All Evaluation
router.get('/', async(req, res) => {
  
   try{
       console.log("hessre")
    // const getAllEvaluation = await evalFunctions.getAllEvaluations()
    const getAllEvaluation = await Evaluation.find().populate('seller')
    console.log(getAllEvaluation)
    
    res.status(200).json(getAllEvaluation)
   }
   catch (err) {
       res.status(404).json({message: err.message})
   }
})

// Post Evaluation

router.post('/', async(req, res) => {

    const {
        seller,
        
        color,
        detail,
        purchase_price,
        recondition
     
    } = req.body


    const evaluationDestructure = {}

    if(seller){
        evaluationDestructure.seller = req.body.seller
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


//Get Evaluation By Id
router.get('/:evaluationId', async (req, res) => {

    const id = req.params.evaluationId
    
    try{
        const getById = await evalFunctions.getEvalById(id)
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
        color,
        detail,
        purchase_price,
        status,
        dry_cleaning,
        maintenance
        
    } = req.body

    const evaluationDestructure = {}

    if(seller){
        evaluationDestructure.seller = req.body.seller
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
    if(dry_cleaning){
        evaluationDestructure.dry_cleaning = req.body.dry_cleaning
    }
    if(maintenance){
        evaluationDestructure.maintenance = req.body.maintenance
    }

try{
    const patchAll = await Evaluation.findOneAndUpdate({_id: req.params.evaluationId},{$set: evaluationDestructure})
        res.status(200).json(patchAll)
} catch(err){
    res.status(404).json({ message: err })
}

})


//Delete evaluation

router.delete('/:evaluationId', async (req, res) => {
    id= req.params.evaluationId
    
    try{
         
    const deleteEvaluation = await evalFunctions.getEvalById(id)
    console.log(deleteEvaluation)
    deleteEvaluation.remove()
    res.status(200).json({success: true})
    }

    catch(err){
        res.status(200).json({ message: err})
    }
})



module.exports = router;