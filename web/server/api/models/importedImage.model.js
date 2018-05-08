const mongoose = require('mongoose');
const moment = require('moment-timezone');
const APIError = require('../utils/APIError');

const { env } = require('../../config/vars');

const importedImageSchema = new mongoose.Schema({
  displayName: {
    type: String,
  },
  sha1Hash: {
    type: String,
  },
  importOperation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ImageImportOperation'
  },
});

importedImageSchema.statics = {
  async get(id) {
    try {
      let importedImage;

      if (mongoose.Types.ObjectId.isValid(id)) {
        importedImage = await this.findById(id).exec();

        if (importedImage) {
          return importedImage;
        }

        throw new APIError({
          message: 'Imported image does not exist',
          status: httpStatus.NOT_FOUND,
        });
      }
    } catch (error) {
      throw error;
    }
  },
}

module.exports = mongoose.model('ImportedImage', importedImageSchema);
