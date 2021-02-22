const express = require('express');
const log = require('../utils/log');

const {
  addComment,
  editComment,
  deleteComment,
} = require('../modules/database');

const commentController = express.Router();

commentController.post('/add', async (req, res) => {
  try {
    const {
      body,
    } = req;

    if (!body) {
      throw new Error('empty body');
    }
    else {
      const {
        comment,
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
      body,
    } = req;

    if (!body) {
      throw new Error('empty body');
    }
    else {
      const {
        comment,
        title,
        commentTitle,
      } = body;

      if (!comment || !title || !commentTitle) {
        throw new Error(`bad body -> ${JSON.stringify(body)}`);
      }
      else {
        const result = await editComment(comment, title, commentTitle);

        if (!result.success) {
          throw new Error(`error: ${result.error}`);
        }
        else {
          res.send({ success: true });
        }
      }
    }
  }
  catch (error) {
    log.error(`[commnet]: POST /edit -> ${error.message}`);
    res.send({ success: false });
  }
});

commentController.delete('/delete', async (req, res) => {
  try {
    const {
      body,
    } = req;

    if (!body) {
      throw new Error('empty body');
    }
    else {
      const {
        title,
        commentTitle,
      } = body;

      if (!title || !commentTitle) {
        throw new Error(`bad body -> ${JSON.stringify(body)}`);
      }
      else {
        const result = await deleteComment(title, commentTitle);

        if (!result.success) {
          throw new Error(`error :${result.error}`);
        }
        else {
          res.send({ success: true });
        }
      }
    }
  }
  catch (error) {
    log.error(`[comment]: DELETE /delete -> ${error.message}`);
    res.send({ success: false });
  }
});

module.exports = commentController;
