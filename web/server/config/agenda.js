const Agenda = require('agenda');
const config = require('./vars');

const agenda = new Agenda({ db: { address: config.mongo.uri }});

require('../jobs/unpackImportedImageZip.job')(agenda);
require('../jobs/processImportedImage.job')(agenda);
require('../jobs/startImageScrapeOperation.job')(agenda);
require('../jobs/processImageScrapeOperationResults.job')(agenda);
require('../jobs/processImageImportOperation.job')(agenda);

agenda.on('ready', function () {
  agenda.start();
  console.log('agenda worker started');

  //todo remove
  // agenda.cancel({}, (a,b) => {
  //   console.log(`canceled ${a} ${b}`);
  // });
});

module.exports = agenda;
