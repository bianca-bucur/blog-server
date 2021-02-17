const express = require('express');
const log = require('../utils/log');
const {
  addUser,
  authUser,
  getAllUsers,
  editUser,
  removeUser,
} = require('../modules/database');

const userController = express.Router();

userController.post('/add', async (req, res) => {
  try {
    const {
      body,
    } = req;

    if (!body) {
      throw new Error('[user]: POST /add -> empty body');
    }
    else {
      const {
        name,
        username,
        password,
        type,
        createdOn,
      } = body;

      if (!name || !username || !password || !type || !createdOn) {
        throw new Error(`[user]: POST /add -> bad body: ${JSON.stringify(body)}`);
      }
      else {
        const result = await addUser(body);

        if (!result.success) {
          throw new Error(`[user]: add user failed: ${result.error.message}`);
        }
        else {
          res.send({ success: true });
        }
      }
    }
  }
  catch (error) {
    log.error(error.message);
    res.send({ success: false });
  }
});

userController.post('/edit', async (req, res) => {
  try {
    const {
      body,
    } = req;

    if (!body) {
      throw new Error('[user]: POST /edit -> empty body');
    }
    else {
      const {
        username,
        userData,
      } = body;

      if (!username || !userData) {
        throw new Error(`[user]: POST /edit -> bad body: ${JSON.stringify(body)}`);
      }
      else {
        const result = await editUser(username, userData);

        if (!result.success) {
          throw new Error(`[user]: POST /edit -> error: ${result.error.message}`);
        }
        else {
          res.send({ success: true });
        }
      }
    }
  }
  catch (error) {
    log.error(error.message);
    res.send({ success: false });
  }
});


module.exports = userController;
