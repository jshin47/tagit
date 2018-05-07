const httpStatus = require('http-status');
const { omit } = require('lodash');
const ImportedImage = require('../models/importedImage.model');
const { handler: errorHandler } = require('../middlewares/error');

exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    const importedImage = await ImportedImage.get(id);
    if (importedImage) {
      res.json(importedImage);
    } else {
      next('Not implemented!');
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
    const importedImage = new ImportedImage(req.body);
    const savedImportedImage = await importedImage.save();
    res.status(httpStatus.CREATED);
    res.json(savedImportedImage);
  } catch (error) {
    next(error);
  }
};
