const _ = require('lodash');

const config = {
  dev: 'development',
  test: 'testing',
  prod: 'production',
  port: process.env.PORT,
  expireTime: 24 * 60 * 10,
  secrets: {
    jwt: process.env.JWT || 'gumball',
  },
};

process.env.NODE_ENV = process.env.NODE_ENV || config.dev;
config.env = process.env.NODE_ENV;

const envConfig = require(`./${config.env}`);

module.exports = _.merge(config, envConfig);
