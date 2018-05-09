const mongoose = require('mongoose');
const moment = require('moment-timezone');
const APIError = require('../api/utils/APIError');

const { env } = require('../config/vars');

const imageScrapeOperationSchema = new mongoose.Schema({
  source: {
    type: String,
  },
  keyword: {
    type: String,
  },
  detail: {
    type: Boolean,
  },
  maxResults: {
    type: Number,
  },
  userAgentString: {
    type: String,
  },
  nightmareOptions: {
    type: mongoose.Schema.Types.Mixed,
  },
  rateLimit: {
    type: Number,
  },
  timeout: {
    type: Number,
  },
});

imageScrapeOperationSchema.statics = {
  async retrieve(id) {
    try {
      let imageScrapeOperation;

      if (mongoose.Types.ObjectId.isValid(id)) {
        imageScrapeOperation = await this.findById(id).exec();

        if (imageScrapeOperation) {
          return imageScrapeOperation;
        }

        throw 'error';
      }
    } catch (e) {
      throw e;
    }
  }
};

