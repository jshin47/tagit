const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/imageImportOperation.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  /**
   * @api {post} v1/imageImportOperations Create Image Import Operation
   * @apiDescription Create a new image import operation
   * @apiVersion 1.0.0
   * @apiName CreateImageImportOperation
   * @apiGroup ImageImportOperation
   * @apiPermission user
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}             displayName     Image import operation's display name
   *
   * @apiSuccess (Created 201) {String}  id         Image Import Operation's id
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(controller.create);

router
  .route('/:id')
  /**
   * @api {get} v1/imageImportOperations/:id Get Image Import Operation
   * @apiDescription Get image import operation information
   * @apiVersion 1.0.0
   * @apiName GetImageImportOperation
   * @apiGroup ImageImportOperation
   * @apiPermission user
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {String}  id         ImageImportOperation's ID
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .get(controller.get)
  /**
   * @api {put} v1/imageImportOperations/:id Put Image Import Operation
   * @apiDescription Get image import operation information
   * @apiVersion 1.0.0
   * @apiName GetImageImportOperation
   * @apiGroup ImageImportOperation
   * @apiPermission user
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {String}  id         ImageImportOperation's ID
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .put(controller.finalizeOrUpdate);

module.exports = router;
