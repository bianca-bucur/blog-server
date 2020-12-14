const express = require('express');
const log = require('../utils/log');

const {
  addPost,
  editPost,
  removePost,
} = require('../modules/database');

const postController = express.Router();

postController.post('/add', async (req, res) => {
  let result = {};
  try {
    const {
      body
    } = req;

    if (!body) {
      throw new Error('empty body');
    }
    else {
      const {
        post
      } = body;
    }
  }
  catch(error) {
    log.error(`[post]: POST /add -> ${error.message}`);
    res.send({ success: false });
  }
});

module.exports = postController;