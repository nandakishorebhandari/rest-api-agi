const bodyParser = require('body-parser');
const mockedMorgan = require('./mocked-morgan-middleware');
const config = require('../config');


module.exports = function (app) {
  if (config.logging) {
    const morgan = require('morgan');
    app.use(morgan('dev'));
  }
  app.use(bodyParser.urlencoded({ extended: true, }));
  app.use(bodyParser.json());
  app.use(mockedMorgan);
};
