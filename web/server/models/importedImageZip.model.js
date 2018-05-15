const mongoose = require('mongoose');
const moment = require('moment-timezone');
const APIError = require('../api/utils/APIError');

const { env } = require('../config/vars');

const importedImageZipSchema = new mongoose.Schema({
  sha1Hash: {
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
  fileName: {
    type: String,
  },
  metadataMap: {
    type: mongoose.Schema.Types.Mixed,
  },
});

importedImageZipSchema.statics = {
  async retrieve(id) {
    try {
      let importedImageZip;

      if (mongoose.Types.ObjectId.isValid(id)) {
        importedImageZip = await this.findById(id).exec();

        if (importedImageZip) {
          return importedImageZip;
        }

        throw 'error';
      }
    } catch (error) {
      throw error;
    }
  },
}

module.exports = mongoose.model('ImportedImageZip', importedImageZipSchema);
