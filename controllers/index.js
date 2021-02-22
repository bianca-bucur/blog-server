const express = require('express');
const log = require('../utils/log');
const {
  authUser,
  checkToken,
} = require('../modules/database');

const controllers = express.Router();

controllers.use((req, res, next) => {
  log.info(`[http]: req from ${req.connection.remoteAddress} ${req.method} @ ${req.path}`);
  next();
});

controllers.post('/user/login', async (req, res) => {
  try {
    const {
      body,
    } = req;

    if (!body) {
      throw new Error('POST /login -> empty body');
    }
    else {
      const {
        username,
        password,
      } = body;

      if (!username || !password) {
        throw new Error(`POST /login -> bad body: ${JSON.stringify(body)}`);
      }
      else {
        const result = await authUser(username, password);

        if (!result.success) {
          throw new Error(`POST /login -> auth failed: ${result.error.message}`);
        }
        else {
          const {
            type,
            token,
          } = result;

          res.send({ success: true, type, token });
        }
      }
    }
  }
  catch (error) {
    log.error(`[auth]: ${error.message}`);
  }
});

controllers.use(async (req, res, next) => {
  if (req.path !== '/user/login') {
    const authHeader = req.headers.authorization || null;

    if (!authHeader) {
      res.sendStatus(403);
    }
    else {
      const authData = authHeader.split(':');
      const result = await checkToken(authData[0], authData[1]);

      if (result) {
        log.info('[checkToken middleware]: ok');
        next();
      }
      else {
        log.error('[checkToken middleware]: auth failed');
        res.sendStatus(403);
      }
    }
  }
  else {
    next();
  }
});

controllers.use('/post', require('./postController'));
controllers.use('/comment', require('./commentController'));
controllers.use('/user', require('./userController'));

module.exports = controllers;
