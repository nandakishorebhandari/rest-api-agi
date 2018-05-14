const { errorLog, } = require('../../util/logger');

module.exports = (error, req, res, next) => {
  if (error !== null) {
    console.error(errorLog(error.message));
    res.status(500).send(error);
  }
};