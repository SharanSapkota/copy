const express = require('express');
const Evaluation = require('../../models/admin/Evaluation')
const router = express.Router();


const AuthController = require("../../controllers/authController");

router.get('/',AuthController.authAdmin, async(req, res) => {
   const getAllEvaluation = await Evaluation.find()
   res.status(200).json(getAllEvaluation)
})

router.post('/',AuthController.authAdmin, async(req, res) => {

    const {
        seller,
        listing_type,
        color,
        detail,
        purchase_price
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

    const postEvaluation = new Evaluation(evaluationDestructure)
    try {
        await postEvaluation.save()
        res.status(200).json({success: true})
    }
    catch( err) {
        res.status(404).json({message: err})
    }
})

router.patch('/:evaluationId', async(req, res) => {
    const {
        seller,
        listing_type,
        color,
        detail,
        purchase_price,
        status,
        dry_cleaning,
        maintanance
        
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
    if(dry_cleaning){
        evaluationDestructure.dry_cleaning = req.body.dry_cleaning
    }
    if(maintanance){
        evaluationDestructure.maintanance = req.body.maintanance
    }



    try{
        const patchAll = await Evaluation.findOneAndUpdate({_id: req.params.evaluationId},{$set: evaluationDestructure})
            res.status(200).json(patchAll)
    } catch(err){
        res.status(404).json({ message: err })
    }
})

module.exports = router;