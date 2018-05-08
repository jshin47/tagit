const httpStatus = require('http-status');
const { omit } = require('lodash');
const fs = require('fs');
const crypto = require('crypto');
const ImportedImage = require('../models/importedImage.model');
const ImageImportOperation = require('../models/imageImportOperation.model');
const { handler: errorHandler } = require('../middlewares/error');

function checksumFile(hashName, path) {
  return new Promise((resolve, reject) => {
    let hash = crypto.createHash(hashName);
    let stream = fs.createReadStream(path);
    stream.on('error', err => reject(err));
    stream.on('data', chunk => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

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

    const existingOperation = await ImageImportOperation.get(req.body.importOperation);
    console.log(existingOperation);

    if (!existingOperation || existingOperation.finishedAt) {
      res.status(httpStatus.NOT_ACCEPTABLE);
      res.end();
    } else {
      const { file } = req;

      const sha1Hash = await checksumFile('sha1', file.path);

      const importedImage = new ImportedImage({
        ...req.body,
        sha1Hash,
      });
      const savedImportedImage = await importedImage.save();
      res.status(httpStatus.CREATED);
      res.json(savedImportedImage);
    }
  } catch (error) {
    next(error);
  }
};
