const mongoose = require('mongoose');
const APIError = require('../api/utils/APIError');

const { env } = require('../config/vars');

const imageAnnotationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  annotator: {
    type: String,
  },
  datasetImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DatasetImage',
  },
}, {
  timestamps: true,
});

imageAnnotationSchema.statics = {
  async retrieve(id) {
    try {
      let imageAnnotation;

      if (mongoose.Types.ObjectId.isValid(id)) {
        imageAnnotation = await this.findById(id).exec();
        return imageAnnotation;
      } else {
        throw new Error('Invalid object id');
      }
    } catch (error) {
      throw error;
    }
  },
}

module.exports = mongoose.model('ImageAnnotation', imageAnnotationSchema);
