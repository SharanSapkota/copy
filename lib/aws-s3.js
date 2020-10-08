const AWS = require("aws-sdk");
const Sharp = require("sharp");

const AWSS3 = async (file, width = 500, height = 500, prepend = "") => {
  let fileType = file.originalname.substr(
    file.originalname.lastIndexOf(".") + 1
  );
  let fileName = prepend + Date.now() + "." + fileType;

  let s3bucket = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_REGION
  });

  let params = {
    Body: file,
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    ContentType: file.mimetype
  };

  const buffer = await Sharp(file.buffer)
    .resize(width, height)
    .toBuffer();

  params.Body = buffer;

  params.Key = width + "-" + height + "-" + params.Key;

  try {
    s3bucket.upload(params, (err, data) => {
      if (err) {
        return res.status(500).json({ error: "Error -> " + err });
      } else if (data) {
        return res.json({
          data: data,
          message: "File uploaded successfully! -> keyname = " + params.Key
        });
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      errors: { msg: "Server error", error: err }
    });
  }
};

module.exports = AWSS3;
