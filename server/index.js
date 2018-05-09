const express = require('express');
const app = express();
const api = require('./api');
const logger = require('./util/logger');
const config = require('./config');
const errorHandler = require('./middleware/error-middleware');

require('mongoose')
  .connect(config.db.url)
  .then(() => {
    logger.log('db connected\n'.green);
  })
  .catch(err => {
    logger.error(`${err}\n`);
  });

require('./middleware/app-middleware')(app);

app.use('/api', api);

app.use(errorHandler);

module.exports = app;