import path from 'path';

import developmentConfig from './env/development';
import testConfig from './env/test';
import productionConfig from './env/production';

const defaults = {
  root: path.join(__dirname, '..'),
  staticFiles: path.join(__dirname, '..', '..', 'build'),
};

const development = Object.assign({}, developmentConfig, defaults);
const test = Object.assign({}, testConfig, defaults);
const production = Object.assign({}, productionConfig, defaults);

const environments = { development, test, production };

const currentEnvironment = environments[process.env.NODE_ENV || 'development'];
export default currentEnvironment;
