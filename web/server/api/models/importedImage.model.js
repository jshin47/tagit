const mongoose = require('mongoose');
const moment = require('moment-timezone');
const APIError = require('../utils/APIError');

const { env } = require('../../config/vars');

const importedImageSchema = new mongoose.Schema({
  displayName: {
    type: String,
  },
  importOperation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ImageImportOperation'
  },
});

module.exports = mongoose.model('ImportedImage', importedImageSchema);
