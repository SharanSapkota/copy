require("dotenv").config();
const Sharp = require("sharp");
const AWS = require("aws-sdk");

let s3bucket = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION
});

async function s3Upload(file, width = 750, height = 994) {
  
  let fileType = file.originalname.substr(
    file.originalname.lastIndexOf(".") + 1
  );
  let fileName = Date.now() + "." + fileType;

  let params = {
    Body: file,
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    ContentType: file.mimetype
  };

  let resizeOptions = {};

  if (width === 0 && height === 0) {
    resizeOptions.fit = "cover";
  } else {
    resizeOptions.fit = "contain";
    resizeOptions.width = width;
    resizeOptions.height = height;
  }
  resizeOptions.background = { r: 255, g: 255, b: 255, alpha: 1 };

  const buffer = await Sharp(file.buffer)
    .resize(resizeOptions)
    .toBuffer();

  params.Body = buffer;

  params.Key = width + "-" + height + "-" + params.Key;

  try {
    const upload = await s3bucket.upload(params).promise();

    return upload.Location;
  } catch (err) {
    return {
      success: false,
      errors: { msg: "Server error", error: err }
    };
  }
}

module.exports = { s3Upload };
