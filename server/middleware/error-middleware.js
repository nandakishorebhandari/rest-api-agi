const { errorLog, } = require('../utils/logger');

module.exports = (error, req, res, next) => {
  if (error !== null) {
    if (error.message === 'Unauthorized' || error.message === 'Wrong credentials') {
      console.error(errorLog(error.message));
      res.status(401).json({ error: error.message, });
    } else {
      console.error(errorLog(error.message));
      res.status(500).json({ error: error.message, });
    }
  }
};
