const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const { AWS_BUCKET_NAME } = process.env;
const setConfig = require('../services/aws-config');
const { v4: uuidv4 } = require('uuid');

// set aws config details and create an instance
setConfig();
const s3 = new aws.S3();

// Check image format
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(
      new Error('Invalid Mime type. Only jpeg or png formats supported'),
      false,
    );
  }
};

// create storage
const upload = multer({
  fileFilter,
  storage: multerS3({
    s3,
    bucket: AWS_BUCKET_NAME,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      let extArray = file.mimetype.split('/');
      let fileExtension = extArray[extArray.length - 1];
      cb(null, uuidv4() + '.' + fileExtension);
    },
  }),
});

const images = upload.array('images', 10);

// upload images to s3
const uploadImages = (req, res) => {
  images(req, res, (err) => {
    if (err) {
      return res.status(422).send({
        error: [{ title: 'Error uploading images', detail: err.message }],
      });
    }
    res.send(req.files.map((image) => image.location)); // send this as req to createProject post method
  });
};

module.exports = uploadImages;
