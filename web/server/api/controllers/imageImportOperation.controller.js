const httpStatus = require('http-status');
const { omit } = require('lodash');
const ImageImportOperation = require('../../models/imageImportOperation.model');
const { handler: errorHandler } = require('../middlewares/error');
const agenda = require('../../agenda-worker');

exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    const importOperation = await ImageImportOperation.retrieve(id);
    if (importOperation) {
      res.json(importOperation);
    } else {
      res.status(httpStatus.NOT_FOUND).end();
    }
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

/**
 * Finalizes or updates an image import operation
 * @public
 */
exports.finalizeOrUpdate = async (req, res, next) => {
  console.log(req.query);
  if (req.query.finalize) {
    exports.finalize(req, res, next);
  } else {
    // not implemented!!!!!11111
    next();
  }
};

/**
 * Finalizes an image import operation
 * @public
 */
exports.finalize = async (req, res, next) => {
  try {
    const { id } = req.params;
    const imageImportOperation = await ImageImportOperation.retrieve(id);
    imageImportOperation.finalizedAt = Date.now();
    const savedImageImportOperation = await imageImportOperation.save();
    agenda.now('image import operation - process', {
      imageImportOperationId: id,
    });
    res.status(httpStatus.OK);
    res.json(savedImageImportOperation);
  } catch (error) {
    next(error);
  }
};
