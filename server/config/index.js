const _ = require('lodash');

const config = {
  port: process.env.PORT,
  expireTime: parseInt(process.env.EXPIRE_TIME),
  secret: process.env.JWT_SECRET,
};

const envConfig = require(`./${process.env.NODE_ENV}`);

module.exports = _.merge(config, envConfig);
