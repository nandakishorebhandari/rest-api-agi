const _ = require('lodash');

const config = {
  dev: 'development',
  test: 'testing',
  prod: 'production',
  port: process.env.PORT,
};

process.env.NODE_ENV = process.env.NODE_ENV || config.dev;
config.env = process.env.NODE_ENV;

const envConfig = require(`./${config.env}`);

module.exports = _.merge(config, envConfig);