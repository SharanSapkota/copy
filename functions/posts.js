
const Post = require('../models/Post')

const getPostById = async (id) => {

    const getPostsById = await Post.findById(id).populate("seller", "username")
    console.log(getPostsById)
    return getPostsById
}

module.exports = {
    getPostById,
}