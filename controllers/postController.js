const express = require('express');
const log = require('../utils/log');

const {
  addPost,
  editPost,
  deletePost,
  getAllPosts,
} = require('../modules/database');

const postController = express.Router();

postController.post('/add', async (req, res) => {
  try {
    const {
      body,
    } = req;

    if (!body) {
      throw new Error('empty body');
    }
    else {
      const {
        post,
      } = body;
      if (!post) {
        throw new Error(`bad body ${JSON.stringify(body)}`);
      }
      else {
        const result = await addPost(post);

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
    log.error(`[post]: POST /addPost -> ${error.message}`);
    res.send({ success: false });
  }
});

postController.post('/editPost', async (req, res) => {
  let result = {};

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
        post,
      } = body;

      if (!title || !post) {
        throw new Error(`bad body: ${JSON.stringify(body)}`);
      }
      else {
        result = await editPost(title, post);

        if (!result.success) {
          throw new Error(`error: ${result.error.message}`);
        }
        else {
          res.send({ success: true });
        }
      }
    }
  }
  catch (error) {
    log.error(`[post]: POST /editPost -> ${error.message}`);
    res.send({ success: false });
  }
});

postController.delete('/deletePost', async (req, res) => {
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
      } = body;

      if (!title) {
        throw new Error(`bad body ${JSON.stringify(body)}`);
      }
      else {
        const result = await deletePost(title);

        if (!result.success) {
          throw new Error(`${result.error.message}`);
        }
        else {
          res.send({ success: true });
        }
      }
    }
  }
  catch (error) {
    log.error(`[post]: DELETE /deletePost -> ${error.message}`);
    res.send({ success: false });
  }
});

postController.get('/all', async (req, res) => {
  try {
    const result = await getAllPosts();

    if (!result.success) {
      throw new Error(`error ${result.error.message}`);
    }
    else {
      res.send({
        success: result.success,
        data: result.data ? result.data : {},
      });
    }
  }
  catch (error) {
    log.error(`[post]: GET /all -> ${error.message}`);
    res.send({ success: false });
  }
});

module.exports = postController;
