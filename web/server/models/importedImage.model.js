const mongoose = require('mongoose');
const moment = require('moment-timezone');
const APIError = require('../api/utils/APIError');

const { env } = require('../config/vars');

const importedImageSchema = new mongoose.Schema({
  sha1Digest: {
    type: String,
  },
  s3Key: {
    type: String,
  },
  importOperation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ImageImportOperation'
  },
  localPath: {
    type: String,
  },
  originalFileName: {
    type: String,
  },
  processedAt: {
    type: Date,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

importedImageSchema.statics = {
  async retrieve(id) {
    try {
      let importedImage;

      if (mongoose.Types.ObjectId.isValid(id)) {
        importedImage = await this.findById(id).exec();

        if (importedImage) {
          return importedImage;
        }

        throw 'error';
      }
    } catch (error) {
      throw error;
    }
  },
}

module.exports = mongoose.model('ImportedImage', importedImageSchema);
