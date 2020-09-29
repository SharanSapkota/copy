const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express()

app.get('/uploadImages',(req, res) => {
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




<<<<<<< HEAD
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
=======
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
>>>>>>> e19881166368fe2d58b6c1f84d7285a5876b2ed3

if(mimetype && extname){
    return cd(null, true);
}else {
    cd("Error: File type error")
}
}

<<<<<<< HEAD
app.post('/upload', (req, res) => {
        upload(req, res, (err) => {
=======
app.post('/uploadImages', (req, res) => {
        upload(req, res, (err) => {
           // console.log(req.files)
>>>>>>> e19881166368fe2d58b6c1f84d7285a5876b2ed3
            if(err) { 
                res.status(404).json({ 
                    msg:err
                })
            } else {
<<<<<<< HEAD
               if(req.file == undefined){
=======
               if(req.files == undefined){
                   
>>>>>>> e19881166368fe2d58b6c1f84d7285a5876b2ed3
                   res.status(404).json({
                       msg: "upload image"
                   })
               } else{
                   res.json({
                       msg:'File uploaded',
<<<<<<< HEAD
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
=======
                       file: `uploadImages/${req.files.filename}`
                   })

                   const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
 
(async () => {
    const files = await imagemin(['uploadImages/*.{jpeg,png}'], {
        destination: 'build/imagesMultiple',
        plugins: [
            imageminJpegtran(),
>>>>>>> e19881166368fe2d58b6c1f84d7285a5876b2ed3
            imageminPngquant({
                quality: [0.6, 0.8]
            })
        ]
    });
 
<<<<<<< HEAD
    
    //=> [{data: <Buffer 89 50 4e …>, destinationPath: 'build/images/foo.jpg'}, …]
})();



app.listen('5000', () => {
    console.log("server started")
})

=======
  //  console.log(files);
   
})();

               }
            }
        })
    })





  


app.listen(3005, () => {
    console.log("server started on 3005")
})
>>>>>>> e19881166368fe2d58b6c1f84d7285a5876b2ed3
