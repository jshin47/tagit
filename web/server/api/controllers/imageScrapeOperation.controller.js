const httpStatus = require('http-status');
const { omit } = require('lodash');
const ImageScrapeOperation = require('../../models/imageScrapeOperation.model');
const { handler: errorHandler } = require('../middlewares/error');
const agenda = require('../../agenda-worker');

/**
 * Get image scrape operation
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    const scrapeOperation = await ImageScrapeOperation.retrieve(id);
    if (scrapeOperation) {
      res.json(scrapeOperation);
    } else {
      res.status(httpStatus.NOT_FOUND).end();
    }
  } catch (e) {
    next(e);
  }
};

/**
 * Create new image scrape operation
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const scrapeOperation = new ImageScrapeOperation(req.body);
    const savedImageImportOperation = await scrapeOperation.save();

    agenda.now('image scrape operation - start', {
      imageScrapeOperationId: savedImageImportOperation._id,
    });

    res.status(httpStatus.CREATED);
    res.json(savedImageImportOperation);
  } catch (error) {
    next(error);
  }
};

/**
 * Finalizes an image scrape operation
 * @public
 */
exports.startScrapeOperation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const scrapeOp = await ImageScrapeOperation.retrieve(id);
    scrapeOp.finishedAt = new Date();
    const saved = await scrapeOp.save();
    res.status(httpStatus.OK);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};
