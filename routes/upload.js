const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

router.get('/upload',(req, res) => {
    res.send("I am in upload route")
})

var storage = multer.diskStorage({
    destination: 'uploads/', 
    filename: function(req, file, cd) {
        const extension = path.extname(file.originalname)
        const filename = file.originalname
        const result = filename.replace(extension,".png")
        cd(null,  file.fieldname + '-' + Date.now() + result)
      console.log(extension)
      console.log(result)
      console.log(file.originalname)
    }
})


var upload = multer({
    storage: storage,
    limits: { fieldSize: 1000000 },
    fileFilter: function(req, file, cd) {
        checkFileType(file, cd)
    }
}).single('myImage');

//Check file TypeError
function checkFileType(file, cd) {
    // Allowed extensions
    var filetypes = /jpeg|jpg|png/;
    //check extension
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//CHeck mine
var mimetype = filetypes.test(file.mimetype)

if(mimetype && extname){
    return cd(null, true);
}else {
    cd("Error: File type error")
}
}

router.post('/upload', (req, res) => {
        upload(req, res, (err) => {
            if(err) { 
                console.log("errr")
                res.status(404).json({ 
                    err
                })
            } else {
               if(req.file == undefined){
                   res.status(404).json({
                       msg: "upload image"
                   })
               } else{
                   res.json({
                       
                       msg:'File uploaded',
                       file: `uploads/${req.file.filename}`

                   })
                  console.log(req.file)
                    


                   const imagemin = require('imagemin');
                   const imageminJpegtran = require('imagemin-jpegtran');
                   const imageminPngquant = require('imagemin-pngquant');
                    
                   (async () => {
                       console.log("heres")
                       const files = await imagemin(['uploads/*.{jpeg,png}'], {
                           destination: 'build/images',
                           plugins: [
                               imageminJpegtran(),
                               imageminPngquant({
                                   quality: [0.6, 0.8]
                               })
                           ]
                       });
                    
                      // console.log(files);
                       
                   })();
               }
            }
        })
    })
  



module.exports = router
