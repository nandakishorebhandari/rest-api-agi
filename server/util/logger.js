require('colors');
const _ = require('lodash');
const config = require('../config');

const noop = () => {};

const consoleLog = config.logging ? console.log.bind(console) : noop;

const logger = {
  log() {
    const args = _.toArray(arguments)
      .map(arg => {
        if (typeof arg === 'object') {
          const string = JSON.stringify(arg, 2);
          return string.magenta;
        } else {
          arg += '';
          return arg.magenta;
        }
      });
    consoleLog.apply(console, args);
  },
  error() {
    const args = _.toArray(arguments)
      .map(arg => {
        arg = arg.stack || arg;
        const name = arg.name || '[ ❌ ERROR ❌ ]';
        return `${name.yellow}  ${arg.red}`;
      });

    consoleLog.apply(console, args);
  },
};

module.exports = logger;