const logger = require('../util/logger');
const colors = require('colors/safe');

module.exports = (req, res, next) => {
  logger.log();
  logger.log('req.body:'.blue);
  logger.log(colors.blue(req.body));
  next();
};
