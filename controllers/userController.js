const express = require('express');
const log = require('../utils/log');
const {
  getAllUsers,
  addUser,
  editUser,
  removeUser,
  checkPass,
  changePass,
  getUser,
} = require('../modules/database');

const userController = express.Router();

userController.get('/getAll', async (req, res) => {
  try {
    const result = await getAllUsers();

    if (!result.success) {
      throw new Error(`error: ${result.error.message}`);
    }
    else {
      res.send({
        success: result.success,
        data: result.data,
      });
    }
  }
  catch (error) {
    log.error(`[user]: GET /getAll -> ${error.message}`);
    res.send({ success: false });
  }
});

userController.get('/get', async (req, res) => {
  try {
    const {
      body,
    } = req;
    if (!body) {
      throw new Error('empty body');
    }
    else {
      const {
        username,
      } = body;

      if (!username) {
        throw new Error(`bad body: ${ JSON.stringify(body) }`);
      }
      else {
        const result = await getUser(username);

        if (!result.success) {
          throw new Error(`error: ${ result.error.message }`);
        }
        else {
          res.send({
            success: result.success,
            user: result.user,
          });
        }
      }
    }
  }
  catch (error) {
    log.error(`[user]: GET /get -> ${ error.message }`);
    res.send({ success: false });
  }
});

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
      } = body;

      if (!name || !username || !password || !type) {
        throw new Error(`bad body: ${JSON.stringify(body)}`);
      }
      else {
        const result = await addUser(body);

        if (!result.success) {
          throw new Error(`add user failed: ${result.error.message}`);
        }
        else {
          res.send({ success: true });
        }
      }
    }
  }
  catch (error) {
    log.error(`[user]: POST /add -> ${ error.message }`);
    res.send({ success: false });
  }
});

userController.post('/checkPass', async (req, res) => {
  try {
    const {
      body,
    } = req;
    if (!body) {
      throw new Error('empty body');
    }
    else {
      const {
        username,
        password,
      } = body;

      if (!username || !password) {
        throw new Error(`bad body: ${JSON.stringify(body)}`);
      }
      else {
        const result = await checkPass(username, password);
        if (!result.success) {
          throw new Error(`error ${result.error.message}`);
        }
        else {
          res.send({ success: true });
        }
      }
    }
  }
  catch (error) {
    log.error(`[user]: POST /checkPass -> ${error.message}`);
    res.send({
      success: false,
    });
  }
});

userController.post('/changePass', async (req, res) => {
  try {
    const {
      body,
    } = req;

    if (!body) {
      throw new Error('empty body');
    }
    else {
      const {
        password,
        newPassword,
        username,
      } = body;

      if (!password || !newPassword || !username) {
        throw new Error(`bad body: ${ JSON.stringify(body) }`);
      }
      else {
        const result = await changePass(body);
        
        if (!result.success) {
          throw new Error(`error ${ result.error.message }`);
        }
        else {
          res.send({ success: true });
        }
      }
    }
  }
  catch (error) {
    log.error(`[user]: POST /changePass -> ${ error.message }`);
    res.send({
      success: false,
    });
  }
});

userController.post('/edit', async (req, res) => {
  try {
    const {
      body,
    } = req;
    if (!body) {
      throw new Error('empty body');
    }
    else {
      const {
        username,
        newUserData,
      } = body;

      if (!username || !newUserData) {
        throw new Error(`bad body: ${JSON.stringify(body)}`);
      }
      else {
        const result = await editUser({ username, newUserData });

        if (!result.success) {
          throw new Error(`error: ${ result.error.message }`);
        }
        else {
          res.send({ success: true });
        }
      }
    }
  }
  catch (error) {
    log.error(`[user]: POST /edit -> ${ error.message }`);
    res.send({
      success:false,
    });
  }
});

userController.delete('/delete', async (res, req) => {
  try {
    const {
      body,
    } = req;

    if (!body) {
      throw new Error('bad body');
    }
    else {
      const {
        username,
      } = body;

      if (!username) {
        throw new Error(`bad body: ${ JSON.stringify(body) }`);
      }
      else {
        const result = await removeUser(username);

        if (!result.success) {
          throw new Error(`error: ${ result.error.message }`);
        }
        else {
          res.send({
            success: true,
          });
        }
      }
    }
  }
  catch (error) {
    log.error(`[user]: DELETE /delete -> ${ error.message }`);
    res.send({ success: false });
  }
});

module.exports = userController;
