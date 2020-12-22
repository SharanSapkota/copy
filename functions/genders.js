const Post = require('../models/Post')

module.exports = (req) => {

    const getByGender =  Post.find({ gender: req.params.gender });
    return getByGender
    

}

