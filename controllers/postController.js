const express = require('express');
const log = require('../utils/log');

const {
  addPost,
  editPost,
  getAllPosts,
  removePost,
  getPost,
} = require('../modules/database');

const postController = express.Router();

postController.post('/get', async (req, res) => {
  try {
    const {
      body,
    } = req;
    if (!body) {
      throw new Error('empty body');
    }
    else {
      const {
        postId,
      } = body;
      if (!postId) {
        throw new Error(`bad body: ${ JSON.stringify(body) }`);
      }
      else {
        const result = await getPost(postId);

        if (!result.success) {
          throw new Error(`error: ${ result.error }`);
        }
        else {
          res.send({
            success: true,
            data: result.post,
          });
        }
      }
    }
  }
  catch (error) {
    log.error(`[post]: POST /get -> ${ error.message }`);
    res.send({success: false});
  }
});

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
        title,
        author,
        category,
        content,
      } = body;
      // if (!post) {
      if (!title || !author || !category || !content) {
        throw new Error(`bad body ${JSON.stringify(body)}`);
      }
      else {
        const result = await addPost(body);

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
    log.error(`[post]: POST /add -> ${error.message}`);
    res.send({ success: false });
  }
});

postController.post('/edit', async (req, res) => {
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
        postId,
        editedPost,
      } = body;

      if (!postId || !editedPost) {
        throw new Error(`bad body: ${JSON.stringify(body)}`);
      }
      else {
        result = await editPost({postId, editedPost});

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
    log.error(`[post]: POST /edit -> ${error.message}`);
    res.send({ success: false });
  }
});

postController.delete('/delete', async (req, res) => {
  try {
    const {
      body,
    } = req;

    if (!body) {
      throw new Error('empty body');
    }
    else {
      const {
        postId,
      } = body;

      if (!postId) {
        throw new Error(`bad body ${JSON.stringify(body)}`);
      }
      else {
        const result = await removePost(postId);

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
    log.error(`[post]: DELETE /delete -> ${error.message}`);
    res.send({ success: false });
  }
});

postController.get('/getAll', async (req, res) => {
  try {
    const result = await getAllPosts();

    if (!result.success) {
      throw new Error(`error ${result.error.message}`);
    }
    else {
      res.send({
        success: result.success,
        data: result.posts ? result.posts : {},
      });
    }
  }
  catch (error) {
    log.error(`[post]: GET /getAll -> ${error.message}`);
    res.send({ success: false });
  }
});

module.exports = postController;
