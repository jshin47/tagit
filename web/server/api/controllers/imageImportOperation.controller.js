const httpStatus = require('http-status');
const { omit } = require('lodash');
const ImageImportOperation = require('../models/imageImportOperation.model');
const { handler: errorHandler } = require('../middlewares/error');

exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    const importOperation = await ImageImportOperation.get(id);
    if (importOperation) {
      res.json(importOperation);
    }
    throw new Error('not implemented!');
  } catch (e) {
    next(e);
  }
};

/**
 * Create new image import operation
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const imageImportOperation = new ImageImportOperation(req.body);
    const savedImageImportOperation = await imageImportOperation.save();
    res.status(httpStatus.CREATED);
    res.json(savedImageImportOperation);
  } catch (error) {
    next(error);
  }
};
