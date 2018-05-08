require('dotenv').config();

const config = require('./server/config');
const app = require('./server');
const logger = require('./server/util/logger');

app.listen(config.port, () => {
  logger.log(`Listening in ${config.env} on port: ${config.port}`.cyan);
});