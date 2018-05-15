/* eslint consistent-return:0 */

// make bluebird promise the default, why?
Promise = require('bluebird'); // eslint-disable-line no-global-assign

const express = require('express');
const logger = require('./logger');

const argv = require('./argv');
const port = require('./port');
const setup = require('./middlewares/frontendMiddleware');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false;
const resolve = require('path').resolve;

require('./config/aws');

const mongoose = require('./config/mongoose');

const app = require('./config/express');
module.exports = app;

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

mongoose.connect()
    .then(listen)
    .catch(console.error);

function listen () {
    if (app.get('env') === 'test') return;

    app.listen(port, host, (err) => {
        if (err) {
            return logger.error(err.message);
        }

        // Connect to ngrok in dev mode
        if (ngrok) {
            ngrok.connect(port, (innerErr, url) => {
                if (innerErr) {
                    return logger.error(innerErr);
                }

                logger.appStarted(port, prettyHost, url);
            });
        } else {
            logger.appStarted(port, prettyHost);
        }
    });

    console.log('Express app started on port ' + port);
}
