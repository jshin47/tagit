const ImportedImageZip = require('../models/importedImageZip.model');

module.exports = function (agenda) {
  agenda.define('unpack imported image zip', function (job, done) {
    ImportedImageZip.retrieve(job.attrs.data.importedImageZipId)
      .then((importedImageZip) => {

        done();

      });
  });
}
