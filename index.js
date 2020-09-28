const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express()

app.get('/',(req, res) => {
    res.send("here I am")
})


const storage = multer.diskStorage({
    destination: 'uploads/', 
    filename: function(req, file, cd) {
        cd(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})




const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function(req, file, cd) {
        checkFileType(file, cd)
    }
}).single('myImage');

//Check file TypeError
function checkFileType(file, cd) {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png/;
    //check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//CHeck mine
const mimetype = filetypes.test(file.mimetype)

if(mimetype && extname){
    return cd(null, true);
}else {
    cd("Error: File type error")
}
}

app.post('/upload', (req, res) => {
        upload(req, res, (err) => {
            if(err) { 
                res.status(404).json({ 
                    msg:err
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
               }
            }
        })
    })





    const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminJpegtran = require('imagemin-jpgtran');
const imageminPngquant = require('imagemin-pngquant');
 
(async () => {
    const files = await imagemin(['uploads/*.{jpg,png}'], {
        destination: 'build/images',
        plugins: [
            imageminJpegtran(),
            imageminJpgtran(),
            imageminPngquant({
                quality: [0.6, 0.8]
            })
        ]
    });
 
    
    //=> [{data: <Buffer 89 50 4e …>, destinationPath: 'build/images/foo.jpg'}, …]
})();



app.listen('5000', () => {
    console.log("server started")
})

