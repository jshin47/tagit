const resolve = require('path').resolve;
const pullAll = require('lodash/pullAll');
const uniq = require('lodash/uniq');

const ReactBoilerplate = {
  // This refers to the react-boilerplate version this project is based on.
  version: '3.5.0',

  /**
   * The DLL Plugin provides a dramatic speed increase to webpack build and hot module reloading
   * by caching the module metadata for all of our npm dependencies. We enable it by default
   * in development.
   *
   *
   * To disable the DLL Plugin, set this value to false.
   */
  dllPlugin: {
    defaults: {
      /**
       * we need to exclude dependencies which are not intended for the browser
       * by listing them here.
       */
      exclude: [
        'agenda',
        'aws-sdk',
        'axios',
        'bcryptjs',
        'bluebird',
        'body-parser',
        'chalk',
        'compression',
        'connect-flash',
        'connect-mongo',
        'cookie-parser',
        'cookie-session',
        'cors',
        'cross-env',
        'csurf',
        'dotenv',
        'dotenv-safe',
        'express',
        'express-session',
        'express-validation',
        'helmet',
        'http-status',
        'images-scraper',
        'ip',
        'joi',
        'jwt-simple',
        'lodash',
        'md5',
        'method-override',
        'minimist',
        'moment-timezone',
        'mongoose',
        'morgan',
        'multer',
        'multer-s3',
        'passport',
        'passport-http-bearer',
        'passport-jwt',
        'passport-local',
        'path',
        'pm2',
        'sanitize.css',
        'uuid',
        'winston',
      ],

      /**
       * Specify any additional dependencies here. We include core-js and lodash
       * since a lot of our dependencies depend on them and they get picked up by webpack.
       */
      include: ['core-js', 'eventsource-polyfill', 'babel-polyfill', 'lodash'],

      // The path where the DLL manifest and bundle will get built
      path: resolve('../node_modules/react-boilerplate-dlls'),
    },

    entry(pkg) {
      const dependencyNames = Object.keys(pkg.dependencies);
      const exclude = pkg.dllPlugin.exclude || ReactBoilerplate.dllPlugin.defaults.exclude;
      const include = pkg.dllPlugin.include || ReactBoilerplate.dllPlugin.defaults.include;
      const includeDependencies = uniq(dependencyNames.concat(include));

      return {
        reactBoilerplateDeps: pullAll(includeDependencies, exclude),
      };
    },
  },
};

module.exports = ReactBoilerplate;
