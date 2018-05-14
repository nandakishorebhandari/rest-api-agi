require('dotenv').config();
const { successLog, } = require('./util/logger');

const config = require('./server/config');
const app = require('./server');

app.listen(config.port, () => {
  console.log(successLog(`Listening in ${config.env} on port: ${config.port}`));
});