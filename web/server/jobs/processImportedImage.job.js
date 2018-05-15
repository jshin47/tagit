const AWS = require('aws-sdk');
const downloader = require('s3-download-stream');
const crypto = require('crypto');
const path = require('path');

const ImportedImage = require('../models/importedImage.model');
const DatasetImage = require('../models/datasetImage.model');

const s3 = new AWS.S3({});

module.exports = function (agenda) {
  agenda.define('imported image - process', function (job, done) {
    ImportedImage.retrieve(job.attrs.data.importedImageId)
      .then((importedImage) => {
        importedImage.processedAt = Date.now();
        return importedImage.save();
      })
      .then((savedImportedImage) => {
        console.log('imported saved Import image');
        done();
      });
  });
};
