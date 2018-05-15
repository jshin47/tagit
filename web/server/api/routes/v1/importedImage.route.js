const express = require('express');
const validate = require('express-validation');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('../../middlewares/multer/s3.multer-storage');
const controller = require('../../controllers/importedImage.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const path = require('path');

const s3 = new aws.S3({});

const storage = multerS3({
  s3,
  bucket: 'baloo-tagit-repository',
  metadata: function (req, file, cb) {
    cb(null, {fieldName: file.fieldname});
  },
  key: function (req, file, cb) {
    cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname)
  }
});

const ACCEPTED_IMAGE_TYPES = ['jpg', 'jpeg', 'bmp', 'png', 'gif', 'tiff'];

var upload = multer({
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname).slice(1).toLowerCase();
    if (ACCEPTED_IMAGE_TYPES.includes(ext)) {
      cb(null, true);
    } else {
      cb('Error: Image upload only supports the following types: ' + ACCEPTED_IMAGE_TYPES.join(', '));
    }
  },
  storage,
});

const router = express.Router();

router
  .route('/')
  /**
   * @api {get} v1/importedImages Get imported images
   * @apiDescription Get imported image
   * @apiVersion 1.0.0
   * @apiName GetImportedImage
   * @apiGroup ImportedImage
   * @apiPermission user
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {String}  id         ImportedImage's ID
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .get(controller.search)
  /**
   * @api {post} v1/importedImages Create Image Import Operation
   * @apiDescription Create a new imported image
   * @apiVersion 1.0.0
   * @apiName CreateImportedImage
   * @apiGroup ImportedImage
   * @apiPermission user
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}             imageImportOperation     Image import operation's id
   *
   * @apiSuccess (Created 201) {String}  id         Imported image's id
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(upload.single('image'), controller.create);

router
  .route('/:id')
  /**
   * @api {get} v1/importedImages/:id Get Imported Image
   * @apiDescription Get imported image
   * @apiVersion 1.0.0
   * @apiName GetImportedImage
   * @apiGroup ImportedImage
   * @apiPermission user
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}              id     imported image's id
   *
   * @apiSuccess {String}  id         ImportedImage's ID
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .get(controller.get);

module.exports = router;
