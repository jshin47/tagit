const AWS = require('aws-sdk');
const downloader = require('s3-download-stream');
const crypto = require('crypto');
const path = require('path');

const ImportedImage = require('../models/importedImage.model');
const DatasetImage = require('../models/datasetImage.model');

const s3 = new AWS.S3({});

module.exports = function (agenda) {
  agenda.define('imported image - process', function (job, done) {
    let _importedImage;
    ImportedImage.retrieve(job.attrs.data.importedImageId)
      .then((importedImage) => {
        _importedImage = importedImage;
        console.log(importedImage.sha1Digest);
        return DatasetImage.findOne({
          sha1Digest: importedImage.sha1Digest,
        }).exec();
      })
      .then((existingDatasetImage) => {
        let datasetImage;
        if (!existingDatasetImage) {
          datasetImage = new DatasetImage({
            sha1Digest: _importedImage.sha1Digest,
            s3Key: _importedImage.s3Key,
            importedImages: [_importedImage._id],
          });
        } else {
          datasetImage = existingDatasetImage;
          if (!datasetImage.importedImages) {
            datasetImage.importedImages = [_importedImage._id];
          } else {
            datasetImage.importedImages.push(_importedImage._id);
            // datasetImage.importedImages = [...datasetImage.importedImages, _importedImage._id];
            datasetImage.markModified('importedImages');
          }
        }

        return datasetImage.save();
      })
      .then((datasetImage) => {
        _importedImage.processedAt = Date.now();
        return _importedImage.save();
      })
      .then(() => done())
      .catch((e) => done(e));
  });
};
