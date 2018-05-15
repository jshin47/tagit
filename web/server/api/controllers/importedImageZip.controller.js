const httpStatus = require('http-status');
const { omit } = require('lodash');
const fs = require('fs');
const crypto = require('crypto');
const ImportedImageZip = require('../../models/importedImageZip.model');
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
    const importedImageZip = await ImportedImageZip.retrieve(id);
    if (importedImageZip) {
      res.json(importedImageZip);
    } else {
      next('Not implemented!');
    }
  } catch (e) {
    next(e);
  }
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
      const importedImageZip = new ImportedImageZip({
        fileName: file.key,
        ...req.body,
      });
      const savedImportedImageZip = await importedImageZip.save();
      agenda.now('imported image zip - process', {
        importedImageZipId: savedImportedImageZip._id,
      });
      res.status(httpStatus.CREATED);
      return res.json(savedImportedImageZip);
    }
  } catch (error) {
    next(error);
  }
};
