
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router()

router.get('/uploadImages',(req, res) => {
    res.send("I am in the upload images route")
})


var storage = multer.diskStorage({
    destination: 'uploadImages/', 
    filename: function(req, files, cd) {
        
      //  cd(null, files.fieldname + '-' + Date.now() + path.extname(files.originalname))
        const extension = path.extname(files.originalname)
        const filename = files.originalname
        const result = filename.replace(extension,".png")
        cd(null,  files.fieldname + '-' + Date.now() + result)
      console.log(extension)
    //  console.log(result)
     // console.log(files.originalname)
    }
})




var upload = multer({
    storage: storage,
  //  limits: { fileSize: 3 * 1024 * 1024 },
    fileFilter: function(req, file, cd) {
        checkFileType(file, cd)
    }
}).array('images', 3);

//Check file TypeError
function checkFileType(files, cd) {
    // Allowed extensions
    var filetypes = /jpeg|jpg|png/;
    //check extension
    var extname = filetypes.test(path.extname(files.originalname).toLowerCase());
//CHeck mine
var mimetype = filetypes.test(files.mimetype)

if(mimetype && extname){
    return cd(null, true);
}else {
    cd("Error: File type error")
}
}

router.post('/uploadimages', (req, res) => {
        upload(req, res, (err) => {
           // console.log(req.files)
            if(err) { 
                res.status(404).json({ 
                    msg:err
                })
            } else {
               if(req.files == undefined){
                   
                   res.status(404).json({
                       msg: "upload image"
                   })
               } else{
                   
                   res.json({
                       msg:'File uploaded',

                       
                       file: `uploadImages/${req.files.filename}`
                       
                   })
                 console.log(req.files.filename)
                //    for(var i=0; i<2; i++){
                       
                //        console.log(req.files[i].buffer)
                // }
                  

                   const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
 
(async () => {
    const files = await imagemin(['uploadImages/*.{jpeg,png}'], {
        destination: 'build/imagesMultiple',
        plugins: [
            imageminJpegtran(),
            imageminPngquant({
                quality: [0.6, 0.8]
            })
        ]
    });
 
  //  console.log(files);
   
})();

               }
            }
        })
    })




module.exports = router;
