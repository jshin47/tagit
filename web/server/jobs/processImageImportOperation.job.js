const AWS = require('aws-sdk');
const downloader = require('s3-download-stream');
const crypto = require('crypto');
const path = require('path');

const ImageImportOperation = require('../models/imageImportOperation.model');
const ImportedImage = require('../models/importedImage.model');
const DatasetImage = require('../models/datasetImage.model');

const s3 = new AWS.S3({});

module.exports = function (agenda) {
  agenda.define('image import operation - process', function (job, done) {

    let importOp;

    ImageImportOperation.retrieve(job.attrs.data.imageImportOperationId)
      .then((importOperation) => {
        importOp = importOperation;
        if (!importOperation.finalizedAt) {
          throw 'Import operation not finalized!';
        } else if (importOperation.processedAt) {
          return null;
        }

        return ImportedImage.find({
          importOperation: importOperation._id,
          processedAt: { $exists: false },
        });
      })
      .then((importedImages) => {

        if (importedImages && importedImages.length > 0) {
          importedImages.forEach((importedImage) => {
            agenda.now('imported image - process', {
              importedImageId: importedImage._id
            });
          });

          agenda.schedule('in 10 seconds', 'image import operation - process', {
            imageImportOperationId: job.attrs.data.imageImportOperationId,
          });

          return;
        } else {

          importOp.processedAt = Date.now();
          return importOp.save();

        }

      })
      .then(() => done())
      .catch((e) => done(e || 'Unknown error'));
  });
};
