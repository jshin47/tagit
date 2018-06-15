const mongoose = require('mongoose');
const moment = require('moment-timezone');
const APIError = require('../api/utils/APIError');

const { env } = require('../config/vars');

const datasetImageSchema = new mongoose.Schema({
  sha1Digest: {
    type: String,
  },
  s3Key: {
    type: String,
  },
  importedImages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ImportedImage',
  }],
  originalFileName: {
    type: String,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

datasetImageSchema.statics = {
  async retrieve(id) {
    try {
      let datasetImage;

      if (mongoose.Types.ObjectId.isValid(id)) {
        datasetImage = await this.findById(id).exec();
        return datasetImage;
      } else {
        throw new Error('Invalid object id');
      }
    } catch (error) {
      throw error;
    }
  },
}

module.exports = mongoose.model('DatasetImage', datasetImageSchema);
