const logger = require('../util/logger');
const colors = require('colors');

module.exports = (err, req, res, next) => {
  if (err !== null) {
    logger.log('Error:'.red);
    logger.log(colors.red(err.message));
    res.status(500).send(err);
  }
};
