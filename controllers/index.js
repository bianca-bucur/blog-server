const express = require('express');
const log = require('../utils/log');
const controllers = express.Router();
const {
  authUser,
  checkToken,
} = require('../modules/database');

controllers.use((req, res, next) => {
  log.info(`[http]: req from ${req.connection.remoteAddress} ${req.method} @ ${req.path}`);
});

controllers.use(async (req, res, next) => {
  next();
});

controllers.use('/post', require('./postController'));

module.exports = controllers;