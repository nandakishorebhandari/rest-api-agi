const logger = require('../util/logger');

module.exports = (err, req, res, next) => {
  if (err !== null) {
    logger.error(err.message);
    res.status(500).send(err);
  }
};
