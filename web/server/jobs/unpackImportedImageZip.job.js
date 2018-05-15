const AWS = require('aws-sdk');
const downloader = require('s3-download-stream');
const unzipStream = require('unzip-stream');
const stream = require('stream');
const crypto = require('crypto');
const path = require('path');
const agenda = require('../agenda-worker');

const ImportedImageModel = require('../models/importedImage.model');
const ImportedImageZip = require('../models/importedImageZip.model');

const s3 = new AWS.S3({});

const ACCEPTED_IMAGE_TYPES = ['jpg', 'jpeg', 'jpgl', 'bmp', 'png', 'gif', 'tiff'];

module.exports = function (agenda) {
  agenda.define('imported image zip - process', function (job, done) {
    console.log(`HANDLE imported image zip - process: ${job.attrs.data}`);
    ImportedImageZip.retrieve(job.attrs.data.importedImageZipId)
      .then((importedImageZip) => {

        const downloaderConfig = {
          client: s3,
          concurrency: 6,
          params: {
            Key: importedImageZip.fileName,
            Bucket: 'baloo-tagit-repository',
          }
        };

        const unzipParser = unzipStream.Parse();
        unzipParser.on('close', done);
        unzipParser.on('error', () => {
          console.log('uh oh!');
          done();
        });

        downloader(downloaderConfig)
          .pipe(unzipParser)
          .on('entry', function (entry) {
            if (entry.type === 'File') {

              const fileName = path.basename(entry.path);
              const fileExtension = path.extname(entry.path).slice(1).toLowerCase();

              console.log(fileExtension);

              if (ACCEPTED_IMAGE_TYPES.includes(fileExtension)) {
                let digest;
                const hash = crypto.createHash('sha1');

                entry.on('data', (data) => {
                  hash.update(data);
                });

                entry.on('end', () => {
                  digest = hash.digest('hex');
                });

                const s3Key = importedImageZip.fileName + '_' + Date.now().toString() + '_' + fileName;

                s3.upload({
                  Bucket: 'baloo-tagit-repository',
                  Key: s3Key,
                  Body: entry,
                }).promise()
                  .then((results) => {
                    const importedImage = new ImportedImageModel({
                      importOperation: importedImageZip.importOperation,
                      sha1Digest: digest,
                      s3Key,
                    });
                    return importedImage.save();
                  })
                  .then((savedImportedImage) => {
                    // agenda.now('imported image - process', {
                    //   importedImageId: savedImportedImage._id,
                    // });
                  });
              }
            }
          });

      });
  });
}
