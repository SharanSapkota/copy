// const express = require('express');
// const { diskStorage } = require('multer');
// const router = express.Router()
// const multer = require('multer')



// const storage = multer.diskStorage ({
//     destination: function (req, file, cd) {
//         cd(null, 'upload/');
//     },
//     filename: function (req,file,cd) {
//         cd(null, new Date().toISOString() + file.originalname)
//     }
// })

// const upload = multer({ storage: storage })

// router.get('/', (req, res) => {
//     res.send("I am in upload route")
// })

// router.post('/', upload.single('image1'), (req, res) => {
// console.log(req.file)
// })


// module.exports = router