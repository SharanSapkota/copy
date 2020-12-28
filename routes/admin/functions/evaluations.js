const Evaluation = require('../../../models/admin/Evaluation')

const getAllEvaluations = async () => {
    const getAllEvaluation = await Evaluation.find()
    console.log(getAllEvaluation)
    return getAllEvaluation
}

const getEvalById = async (id) => {
    const getEval = await Evaluation.findById(id).populate('Seller')
    console.log(getEval)
    return getEval
}

module.exports = {
    getAllEvaluations,
    getEvalById
}