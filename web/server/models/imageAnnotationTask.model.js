const mongoose = require('mongoose');
const APIError = require('../api/utils/APIError');

const { env } = require('../config/vars');

const imageAnnotationTaskSchema = new mongoose.Schema({
  displayName: {
    type: String,
  },
  taskId: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: {
      unique: true,
    },
  },
  description: {
    type: String,
  },
}, {
  timestamps: true,
});

imageAnnotationTaskSchema.statics = {
  async retrieve(id) {
    try {
      let imageAnnotationTask;

      if (mongoose.Types.ObjectId.isValid(id)) {
        imageAnnotationTask = await this.findById(id).exec();
        return imageAnnotationTask;
      } else {
        throw new Error('Invalid object id');
      }
    } catch (error) {
      throw error;
    }
  },
}

const ImageAnnotationTask = mongoose.model('ImageAnnotationTask', imageAnnotationTaskSchema);

const ClassificationImageAnnotationTask = ImageAnnotationTask.discriminator('Classification', new mongoose.Schema({
  labelSets: [{
    name: {
      type: String,
    },
    labels: [{
      displayName: {
        type: String,
      },
      value: {
        type: String,
      },
    }],
  }]
}, {

}));

module.exports = ImageAnnotationTask;
