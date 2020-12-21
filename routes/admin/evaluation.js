const express = require('express');
const Evaluation = require('../../models/admin/Evaluation')
const router = express.Router();


const AuthController = require("../../controllers/authController");

router.get('/',AuthController.authAdmin, async(req, res) => {
   const getAllEvaluation = await Evaluation.find()
   res.status(200).json(getAllEvaluation)
})

router.get('/maintenance',AuthController.authAdmin, async(req, res) => {
    const getAllMaintenance = await Evaluation.find({'maintenance.status' : true})
    res.status(200).json(getAllMaintenance)
 })

 router.get('/dryclean',AuthController.authAdmin, async(req, res) => {
    const getAllDryClean = await Evaluation.find({'dry_cleaning.status' : true})
    res.status(200).json(getAllDryClean)
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

router.patch('/maintenancecomplete/:evaluationId', AuthController.authAdmin, async(req,res) =>{
    try{
        const data = await Evaluation.findOneAndUpdate({_id : req.params.evaluationId}, {
            'maintenance.receivedDate' : Date.now()
        })
        res.status(200).json({success: true});

    }catch(err) {
        res.status(200).send(err)
    }
})

router.patch('/drycleaningcomplete/:evaluationId', AuthController.authAdmin, async(req,res) =>{
    try{
        const data = await Evaluation.findOneAndUpdate({_id : req.params.evaluationId}, {
            'dry_cleaning.receivedDate' : Date.now()
        })
        res.status(200).json({success: true});

    }catch(err) {
        res.status(200).send(err)
    }
})

router.patch('/:evaluationId',AuthController.authAdmin, async(req, res) => {
    const {
        seller,
        listing_type,
        color,
        detail,
        purchase_price,
        status,
        dry_cleaning,
        maintenance
    } = req.body

    var data = await Evaluation.findById(req.params.evaluationId)

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
            if(data.dry_cleaning.status == true && dry_cleaning.status == true) {
                evaluationDestructure.dry_cleaning.sentDate = data.dry_cleaning.sentDate
            }else{
                if(dry_cleaning.status == 'true'){
                    evaluationDestructure.dry_cleaning.sentDate = Date.now();
                }else if(dry_cleaning.status == 'false'){
                    evaluationDestructure.dry_cleaning.sentDate = undefined
                }
            }
            
    }
    if(maintenance){
    
            evaluationDestructure.maintenance = req.body.maintenance
            if(data.maintenance.status == true && maintenance.status == true){
                evaluationDestructure.maintenance.sentDate = data.maintenance.sentDate;
            }else{
                if(maintenance.status == 'true'){
                    evaluationDestructure.maintenance.sentDate = Date.now()
                } else if (maintenance.status == 'false'){
                    evaluationDestructure.maintenance.sentDate = undefined
                }
            }        
    }


    try{
        const patchAll = await Evaluation.findOneAndUpdate({_id: req.params.evaluationId},{$set: evaluationDestructure},{new: true})
            res.status(200).json(patchAll)
    } catch(err){
        res.status(404).json({ message: err })
    }
})

router.delete('/:evaluationId',AuthController.authAdmin, async(req,res) =>{
    const deleteId = req.params.evaluationId
    console.log(deleteId)
    const data = await Evaluation.findById(deleteId)
    if(data != null){
        data.remove();
        res.status(200).json({message: 'deleted'})
    }else{
        res.status(400).json({message: err.message})
    }
}
)

module.exports = router;