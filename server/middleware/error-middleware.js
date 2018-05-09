const logger = require('../util/logger');

module.exports = (error, req, res, next) => {
  if (error !== null) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};
