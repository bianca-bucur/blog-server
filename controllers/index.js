const express = require('express');
const log = require('../utils/log');
const controllers = express.Router();
const {
  authUser,
  checkToken,
} = require('../modules/database');

controllers.use((req, res, next) => {
  log.info(`[http]: req from ${req.connection.remoteAddress} ${req.method} @ ${req.path}`);
  next();
});

controllers.use(async (req, res, next) => {
  console.log('middleware');
  next();
});

controllers.use('/post', require('./postController'));

module.exports = controllers;
