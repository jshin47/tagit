const mongoose = require('mongoose');
const httpStatus = require('http-status');
const moment = require('moment-timezone');
const APIError = require('../utils/APIError');

const { env } = require('../../config/vars');

const imageImportOperationSchema = new mongoose.Schema({
  displayName: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  finishedAt: {
    type: Date,
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  }
});

imageImportOperationSchema.virtual('importedImages', {
  ref: 'ImportedImage',
  localField: '_id',
  foreignField: 'importOperation',
  justOne: false,
});

imageImportOperationSchema.statics = {

 async get(id) {
   try {
     let imageImportOperation;

     if (mongoose.Types.ObjectId.isValid(id)) {
       imageImportOperation = await this.findById(id).populate({ path: 'importedImages' }).exec();

       if (imageImportOperation) {
         return imageImportOperation;
       }

       throw new APIError({
         message: 'Image import operation does not exist',
         status: httpStatus.NOT_FOUND,
       });
     }
   } catch (error) {
     throw error;
   }
 },

}

module.exports = mongoose.model('ImageImportOperation', imageImportOperationSchema);
