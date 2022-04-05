const {
  environment,
} = require('../config');
const chalk = require('chalk');
const log4js = require('log4js');
log4js.configure({
  appenders: {
    main: {
      type: 'file',
      // TODO: move filename to config?
      filename: 'blog-server.log',
      // max 512 kB?
      maxLogSize: 512 * 1024,
      // max 10 backups
      backups: 10,
      // compress as .gz to save space
      compress: true,
    },
  },
  categories: {
    default: {
      appenders: ['main'],
      level: 'trace',
    },
  },
});

const logger = log4js.getLogger('main');

const dateTime = () => {
  const date = new Date();
  return date.toLocaleString();
};

const Log = {
  info: data => {
    const message = `${dateTime()} >> ${data instanceof Object ? JSON.stringify(data) : data}`;
    console.log(chalk.blue(message));
    logger.info(message.split('>>')[1]);
  },
  write: data => {
    const message = `${dateTime()} >> ${data instanceof Object ? JSON.stringify(data) : data}`;
    console.log(chalk.green(message));
    logger.info(message.split('>>')[1]);
  },
  warn: data => {
    const message = `${dateTime()} >> [WARNING] ${data instanceof Object ? JSON.stringify(data) : data}`;
    console.log(chalk.keyword('orange')(message));
    logger.warn(message.split('>>')[1]);
  },
  error: data => {
    const message = `${dateTime()} >> [ERROR] ${data instanceof Object ? JSON.stringify(data) : data}`;
    console.log(chalk.keyword('red')(message));
    logger.error(message.split('>>')[1]);
  },
  debug: data => {
    if (environment === 'dev') {
      const message = `${dateTime()} >> [DEBUG] ${data instanceof Object ? JSON.stringify(data) : data}`;
      console.log(chalk.keyword('green')(message));
      logger.debug(message.split('>>')[1]);
    }
  },
};

module.exports = Log;
