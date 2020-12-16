const express = require('express');
const log = require('../utils/log');
const {
  addUser,
  editUser,
} = require('../modules/database');

const userController = express.Router();

userController.post('/add', async (req, res) => {
  try {
    const {
      body,
    } = req;

    if (!body) {
      throw new Error(`[user]: POST /add -> empty body`);
    }
    else {
      const {
        username,
        password,
      } = body;

      if (!username || !password) {
        throw new Error(`[user]: POST /add -> bad body: ${JSON.stringify(body)}`);
      }
      else {
        const result = await (username, password, 0);

        if (!result.success) {
          throw new Error(`[user]: add user failed: ${result.error.message}`);
        }
        else {
          res.send({ success: true });
        }
      }
    }
  }
  catch(error) {
    log.error(error.message);
    res.send({ success: false });
  }
});

  
  
module.exports = userController;