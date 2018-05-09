const Agenda = require('agenda');
const config = require('./vars');

const agenda = new Agenda({ db: { address: config.mongo.uri }});

require('../jobs/unpackImportedImageZip.job')(agenda);

agenda.on('ready', function () {
  agenda.start();
  console.log('agenda worker started');
});

module.exports = agenda;
