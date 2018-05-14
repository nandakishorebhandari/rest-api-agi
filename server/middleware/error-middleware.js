const { errorLog, } = require('../utils/logger');

module.exports = (error, req, res, next) => {
  if (error !== null) {
    if (error.name === 'UnauthorizedError') {
      res.status(401).send('Invalid token');
      return;
    }
    console.error(errorLog(error.message));
    res.status(500).send(error);
  }
};