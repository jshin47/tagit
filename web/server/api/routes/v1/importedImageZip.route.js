const express = require('express');
const validate = require('express-validation');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const controller = require('../../controllers/importedImageZip.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const path = require('path');

aws.config.loadFromPath('./aws-config.json');

const s3 = new aws.S3({});




// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, process.cwd() + '/uploads')
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
//   }
// });

const storage = multerS3({
  s3,
  bucket: 'baloo-tagit-repository',
  metadata: function (req, file, cb) {
    cb(null, {
      fieldName: file.fieldname,
    });
  },
  key: function (req, file, cb) {
    cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname);
  }
});

const ACCEPTED_UPLOAD_TYPES = ['zip'];

var upload = multer({
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname).slice(1).toLowerCase();
    if (ACCEPTED_UPLOAD_TYPES.includes(ext)) {
      cb(null, true);
    } else {
      cb('Error: Image zip upload only supports the following types: ' + ACCEPTED_IMAGE_TYPES.join(', '));
    }
  },
  storage,
});

const router = express.Router();

router
  .route('/')
  /**
   * @api {post} v1/importedImageZips Create Imported Image Zip
   * @apiDescription Create a new imported image zip
   * @apiVersion 1.0.0
   * @apiName CreateImportedImageZip
   * @apiGroup ImportedImageZip
   * @apiPermission user
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}             imageImportOperation     Image import operation's id
   * @apiParam  {File}               zipFile                  Zip file
   *
   * @apiSuccess (Created 201) {String}  id         Imported image zip's id
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(upload.single('zipFile'), controller.create);

router
  .route('/:id')
  /**
   * @api {get} v1/importedImageZips/:id Get Imported Image Zip
   * @apiDescription Get imported image zip
   * @apiVersion 1.0.0
   * @apiName GetImportedImageZip
   * @apiGroup ImportedImageZip
   * @apiPermission user
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {String}  id         ImportedImageZip's ID
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .get(controller.get);

module.exports = router;
