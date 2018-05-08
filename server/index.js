const express = require('express');
const app = express();
const api = require('./api');
const config = require('./config');
const logger = require('./util/logger');
const errorHandler = require('./middleware/error-middleware');

require('mongoose')
  .connect(config.db.url)
  .then(() => {
    logger.log('db connected\n'.green);
  })
  .catch(err => {
    logger.log(`db error: ${err}\n`.red);
  });

require('./middleware/app-middleware')(app);

app.use('/api', api);

app.use(errorHandler);

module.exports = app;