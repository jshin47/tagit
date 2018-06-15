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

const s3 = new AWS.S3({});

const ACCEPTED_IMAGE_TYPES = ['jpg', 'jpeg', 'jpgl', 'bmp', 'png', 'gif', 'tiff'];

const Scraper = require('images-scraper');
const GoogleScraper = new Scraper.Google();
const BingScraper = new Scraper.Bing();
const YahooScraper = new Scraper.Yahoo();

module.exports = function (agenda) {
  agenda.define('image scrape operation - start', function (job, done) {

    let scrapeOp;

    ImageScrapeOperation
      .retrieve(job.attrs.data.imageScrapeOperationId)
      .then((imageScrapeOperation) => {
        scrapeOp = imageScrapeOperation;
        switch (imageScrapeOperation.source) {
          case 'google': {
            return GoogleScraper.list({
              keyword: imageScrapeOperation.keyword,
              num: imageScrapeOperation.maxResults,
              detail: true,
              nightmare: {
                show: false,
              }
            });
          }
          case 'bing': {
            return BingScraper.list({
              keyword: imageScrapeOperation.keyword,
              num: imageScrapeOperation.maxResults,
              detail: true,
            });
          }
          case 'yahoo': {
            return YahooScraper.list({
              keyword: imageScrapeOperation.keyword,
              num: imageScrapeOperation.maxResults,
              detail: true,
            });
          }
          default:
            throw new Error('Invalid operation');
        }
      })
      .then((searchResults) => {
        scrapeOp.results = searchResults;
        scrapeOp.markModified('results');
        return scrapeOp.save();
      })
      .then(() => {
        agenda.now('image scrape operation - process results', {
          imageScrapeOperationId: job.attrs.data.imageScrapeOperationId,
        });
        return done();
      });

  });
}
