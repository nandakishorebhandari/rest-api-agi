const express = require('express');
const config = require('./config');
const api = require('./api');
const errorHandler = require('./middleware/error-middleware');
const { successLog, errorLog, } = require('./utils/logger');

const app = express();

require('mongoose')
  .connect(config.db.url)
  .then(() => {
    console.log(successLog('db connected'));
    console.log();
  })
  .catch(err => {
    console.error(errorLog(`${err}\n`));
  });

require('./middleware/app-middleware')(app);

app.use('/api', api);

app.use(errorHandler);

module.exports = app;