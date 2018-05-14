const chalk = require('chalk');

module.exports = {
  successLog: chalk.hex('#FFFFFF').bgGreen.underline.bold,
  errorLog: chalk.bgRed.hex('#000000').bold.underline,
  infoLog: chalk.bgBlue.hex('#000000').inverse,
};