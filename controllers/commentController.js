const express = require('express');
const log = require('../utils/log');

const {
  addComment,
  editComment,
  removeComment,
} = require('../modules/database');

const commentController = express.Router();

commentController.post('/add', async (req, res) => {
  try {
    const {
      body
    } = req;

    if (!body) {
      throw new Error('empty body');
    }
    else {
      const {
        comment
      } = body;

      if (!comment) {
        throw new Error(`bad body: ${JSON.stringify(body)}`);
      }
      else {
        const result = await addComment(comment);

        if (!result.success) {
          throw new Error(`error ${result.error}`);
        }
        else {
          res.send({ success: true });
        }
      }
    }
  }
  catch (error) {
    log.error(`[comment]: POST /add -> ${error.message}`);
    res.send({ success: false });
  }
});

commentController.post('/edit', async (req, res) => {
  try {
    const {
      body
    } = req;

    if (!body) {
      throw new Error('empty body');
    }
    else {
      const {

      }
    }
  }
  catch (error) {
    log.error(`[commnet]: POST /edit -> ${error.message}`);
    res.send({ success: false });
  }
})
