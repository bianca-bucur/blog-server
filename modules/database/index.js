const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const log = require('../../utils/log');
const { customAlphabet } = require('nanoid');

const User = require('./models/users');
const Post = require('./models/blogPost');

let db = null;

const connectToDB = async () => {
  try {
    await mongoose.connect(
      'mongodb://localhost/blog',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        heartbeatFrequencyMS: 1000,
      },
    );
    db = mongoose.connection;

    db.on('err', (error) => {
      log.error(`[database]: ${error.message}`);
    });

    db.once('open', () => {
      log.write('[database]: connected');
    });

    db.on('disconnected', () => {
      log.warn('[database]: disconnected');
    });

    return true;
  }
  catch (error) {
    log.error(`[database]: ${error.message}`);
    return false;
  }
};


//#region Users

const addUser = async (name, password, type) => {
  try {
    const userExists = await User.findOne({ username: name });
    if (!userExists) {
      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);
      if (!hash) {
        throw new Error('could not create hash');
      }
      else {
        const user = new User({
          username: name,
          password: hash,
          type,
          token: '',
        });

        user.save().catch((error) => { throw new Error(error); });
        return {
          success: true,
        };
      }
    }
    else {
      throw new Error('username already exists');
    }
  }
  catch (error) {
    log.error(`[database]: add user error: ${error.message}`);
  }
};

const authUser = async (name, password) => {
  try {
    const user = await User.findOne({ username: name });
    if (user) {
      const getToken = () => {
        const alphabet = '1234567890abcdefghijklmnopqrstuvwxyz!@#$%^&*(){}][<>,.~';
        const nanoid = customAlphabet(alphabet, alphabet.length);
        return nanoid();
      };

      const result = await bcrypt.compare(password, user.password);

      if (result) {
        const authToken = getToken();
        user.token = authToken;
        await user.save();
        return {
          success: true,
          token: user.token,
          type: user.type,
        };
      }
      else {
        throw new Error(`password for ${name} does not match ${password}`);
      }
    }
    else {
      throw new Error(`user ${name} does not exist`);
    }
  }
  catch (error) {
    log.error(`[database]: user authentification error: ${error.message}`);
    return {
      success: false,
      error,
    };
  }
};

const editUser = async (name, newUserData) => {
  try {
    const user = await User.findOne({ name });
    if (user) {
      const result = await User.updateOne({ name }, newUserData);
      return {
        success: result.nModified === 1,
      };
    }
    else {
      throw new Error('no such user');
    }
  }
  catch (error) {
    log.error(`[database]: edit user error ${error.message}`);
    return {
      success: false,
      error,
    };
  }
};

const removeUser = async (name) => {
  try {
    const result = await User.deleteOne({ name });
    return {
      success: result && true,
    };
  }
  catch (error) {
    log.error(`[database]: remove user error: ${error.message}`);
    return {
      success: false,
      error,
    };
  }
};

//#endregion

//#region Posts

const addPost = async (post) => {
  try {
    const {
      content,
      title,
      author,
      category,
    } = post;
    const blogPost = new Post({
      content,
      title,
      author,
      category,
      timeStamp: new Date(Date.now()),
      comments: [],
    });
    blogPost.save().catch((error) => {
      throw new Error(error);
    });
    return {
      success: true,
    };
  }
  catch (error) {
    log.error(`[database]: error adding blog post: ${error.message}`);
    return {
      success: false,
      error,
    };
  }
};

const editPost = async (title, newPost) => {
  try {
    const post = await Post.findOne({ title });
    if (post) {
      const result = await Post.updateOne({ title }, newPost);
      return {
        success: result.nModified === 1,
      };
    }
    else {
      throw new Error('no such post');
    }
  }
  catch (error) {
    log.error(`[database]: edit post error: ${error.message}`);
    return {
      success: false,
      error,
    };
  }
};

const removePost = async (title) => {
  try {
    const result = await Post.deleteOne({ title });
    return {
      success: result && true,
    }
  }
  catch (error) {
    log.error(`[database]: remove post error: ${error.message}`);
    return {
      success: false,
      error,
    };
  }
};

const getPosts = async (title) => {
  try {
    const posts = await Post.find({});
    return {
      success: true,
      data: posts,
    };
  }
  catch (error) {
    log.error(`[database]: get posts error: ${error.message}`);
    return {
      success: false,
      error,
    }
  }
}

//#endregion

module.exports = {
  connectToDB,
  addUser,
  authUser,
  addPost,
  editPost,
  removePost,
  getPosts,
};
