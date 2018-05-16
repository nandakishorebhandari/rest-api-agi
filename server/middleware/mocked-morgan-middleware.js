const { infoLog, } = require('../utils/logger');

module.exports = (req, res, next) => {
  console.log(infoLog('req.body:'));
  console.log(req.body);
  next();
};
