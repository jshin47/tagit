const httpStatus = require('http-status');
const { omit } = require('lodash');
const fs = require('fs');
const crypto = require('crypto');
const ImportedImage = require('../../models/importedImage.model');
const ImageImportOperation = require('../../models/imageImportOperation.model');
const { handler: errorHandler } = require('../middlewares/error');
const agenda = require('../../agenda-worker');

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
    const importedImage = await ImportedImage.retrieve(id);
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
 * Finds all imported images
 * @public
 */
exports.search = async (req, res, next) => {
  const found = await ImportedImage.find().exec();
  res.json(found);
};

/**
 * Create new imported image
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const existingOperation = await ImageImportOperation.retrieve(req.body.importOperation);

    if (!existingOperation || existingOperation.finishedAt) {
      res.status(httpStatus.NOT_ACCEPTABLE);
      return res.end();
    } else {
      const { file } = req;
      console.log(file);
      const importedImage = new ImportedImage({
        ...req.body,
        s3Key: file.key,
        sha1Digest: file.digest,
      });
      const savedImportedImage = await importedImage.save();
      res.status(httpStatus.CREATED);
      return res.json(savedImportedImage);
    }
  } catch (error) {
    next(error);
  }
};
