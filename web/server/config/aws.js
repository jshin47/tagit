const AWS = require('aws-sdk');

AWS.config.loadFromPath('./aws-config.json');

module.exports = AWS;
