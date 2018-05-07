const express = require('express');
const validate = require('express-validation');
const multer = require('multer');
const controller = require('../../controllers/importedImage.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const md5 = require('md5');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.cwd() + '/uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
  }
});
var upload = multer({ storage })

const router = express.Router();

router
  .route('/')
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
   * @apiSuccess {String}  id         ImportedImage's ID
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .get(controller.get);

module.exports = router;
