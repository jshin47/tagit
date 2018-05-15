const AWS = require('aws-sdk');
const downloader = require('s3-download-stream');
const unzipStream = require('unzip-stream');
const stream = require('stream');
const crypto = require('crypto');
const path = require('path');
const agenda = require('../agenda-worker');

const ImageScrapeOperation = require('../models/imageScrapeOperation.model');
const ImportedImageModel = require('../models/importedImage.model');
const ImportedImageZip = require('../models/importedImageZip.model');

const http = require('http');
const https = require('https');

const s3 = new AWS.S3({});

const ACCEPTED_IMAGE_TYPES = ['jpg', 'jpeg', 'jpgl', 'bmp', 'png', 'gif', 'tiff'];

module.exports = function (agenda) {
  agenda.define('image scrape operation - process results', function (job, done) {

    let scrapeOp;

    return ImageScrapeOperation
      .retrieve(job.attrs.data.imageScrapeOperationId)
      .then((imageScrapeOperation) => {
        scrapeOp = imageScrapeOperation;

        Promise.all(imageScrapeOperation.results.map((result) => new Promise(((resolve, reject) => {

          const r = (result.url.startsWith('https')) ? https : http;

          r.get(result.url)
            .on('error', console.log)
            .on('response', (response) => {
              if (response.statusCode === 200) {
                const fileName = path.basename(result.url);
                const s3Key = `imageScrapeOperation_${job.attrs.data.imageScrapeOperationId}_${Date.now().toString()}_${fileName}`;

                let digest;
                const hash = crypto.createHash('sha1');
                hash.setEncoding('hex');

                response.pipe(hash).on('finish', function () {
                  digest = hash.read();
                })

                s3.upload({
                  Bucket: 'baloo-tagit-repository',
                  Body: response,
                  Key: s3Key,
                }, function (err, data) {
                  if (err) {
                    reject();
                  } else {

                    var importedImage = new ImportedImageModel({
                      importOperation: scrapeOp.importOperation,
                      sha1Digest: digest,
                      s3Key,
                    })

                    importedImage.save().then(() => resolve(data));
                  }
                });
              }
            });
        })))).then((allResults) => {
          console.log('all done!');
          console.log(allResults);
          done();
        }).error((err) => {
          console.error(err);
        });

      })

  });
}
