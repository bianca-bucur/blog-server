const {MongoClient} = require('mongodb');
const bcrypt = require('bcrypt');
const { customAlphabet } = require('nanoid');

const userSchema = require('./schemas/userSchema');
const postSchema = require('./schemas/postSchema');
const commentSchema = require('./schemas/commentSchema');

const log = require('../../utils/log');

const { env } = require('../../config');

const { asyncForEach } = require('../../utils');

var db = null;
let User = null;
let Post = null;
let Comment = null;

const client = new MongoClient('mongodb://localhost/blog', {
  useUnifiedTopology: true,
});

const connectToDB = async () => {
  try {
    await client.connect();
    db = client.db('blog');
    User = db.collection('users');
    Post = db.collection('posts');
    Comment = db.collection('comments');
    log.write('connected to db');
    return true;
  }
  catch (error) {
    log.error(`[database]: ${error.message}`);
    return false;
  }
};

//#region Users

const newUserColl = async () => {
  await db.createCollection('users', {
    validator: userSchema,
  });
};

const createUserCollection = () => {
  try {
    const shouldCreate = new Promise((resolve, reject) => {
      db.listCollections({ name: 'users' })
        .next((err, collInfo) => {
          if (err) {
            reject({
              success: false,
              err,
            });
          }
          else if (!collInfo) {
            resolve({
              success: true,
            });
          }
          else {
            reject({
              success: false,
              err: 'collections exists',
            });
          }
        });
    });
    shouldCreate.then((result) => {
      if (result.success) {
        setTimeout(newUserColl.bind(db, shouldCreate));
      }
    })
      .catch((result) => {
        log.error(`[database]: could not create user collection ${result.err}`);
      });
  }
  catch (error) {
    log.error(`[database]: could not create user collection ${error}`);
    return {
      success: false,
      error,
    };
  }
};

const addUser = async (newUser) => {
  try {
    const {
      username,
      name,
      password,
      type,
    } = newUser;
    const userExists = await User.findOne({ username });
    if (!userExists) {
      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);
      if (!hash) {
        throw new Error('could not create hash');
      }
      else {
        const createdOn = new Date(Date.now());
        const user = {
          name,
          username,
          password: hash,
          type,
          token: '',
          createdOn,
        };

        const result = await User.insertOne(user);

        if (result.insertedCount < 1) {
          throw new Error('could not insert new user');
        }
        return {
          success: true,
        };
      }
    }
    else {
      throw new Error(`user with username ${ username } already exists`);
    }
  }
  catch (error) {
    log.error(`[database]: add user error: ${ error.message }`);
    return {
      success: false,
    };
  }
};

const getUser = async (username) => {
  try {

    const user = await User
      .findOne({
        username: username,
      }, {
        projection: {
          _id: 0,
          username: 1,
          name: 1,
          type: 1,
        },
      });
    
    return {
      success: true,
      user,
    };
  }
  catch (error) {
    log.error(`[database]: get user error: ${ error.message }`);
    return {
      success: false,
    };
  }
};

const getAllUsers = async () => {
  try {
    const users = await User.find({}, {
      projection: {
        _id: 0,
        username: 1,
        name: 1,
        type: 1,
      },
    }).toArray();

    console.log(users);

    return {
      success: true,
      users,
    };
  }
  catch (error) {
    log.error(`[database]: get all users error: ${ error.message }`);
    return {
      success: false,
      error,
    };
  }
};

const authUser = async (data) => { 
  try {
    const {
      username,
      password,
    } = data;
    const user = await User.findOne({ username: username });
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
        await User.updateOne({ username: username }, {$set: user});

        return {
          success: true,
          token: user.token,
          type: user.type,
        };
      }
      else {
        throw new Error(`password for ${ username } does not match ${ password }`);
      }
    }
    else {
      throw new Error( `user with username ${username} does not exist`);
    }
  }
  catch (error) {
    log.error(`[database]: authenticate user error: ${ error.message }`);
    return {
      success: false,
      error,
    };
  }
};

const changePass = async (data) => {
  try {
    const {
      password,
      newPassword,
      username,
    } = data;

    const user = await User.findOne({ username: username });

    if (user) {
      const passOK = bcrypt.compare(password, user.password);

      if (passOK) {
        const saltRounds = 10;
        const hash = await bcrypt.hash(newPassword, saltRounds);
        if (!hash) {
          throw new Error('could not create hash');
        }
        else {
          const result = await User.updateOne({ username }, { $set: { password: hash } });
        
          if (result.matchedCount === 1) {
            return {
              success: result.modifiedCount === 1,
            };
          }
          else {
            throw new Error(`no user with username ${ username }`);
          }
        }
      }
      else {
        return {
          success: true,
          result: 'badPass',
        };
      }
    }

  }
  catch (error) {
    log.error(`[database]: change password error ${error.message}`);
    return {
      success: false,
    };
  }
};

const editUser = async (data) => {
  try {
    const {
      username,
      newUserData,
    } = data;

    const result = await User.updateOne(
      { username: username },
      {
        $set:
          {
            ...newUserData,
          },
      },
    );
    if (result.matchedCount === 1) {
      return {
        success: result.modifiedCount === 1,
      };
    }
    else {
      throw new Error(`no user with username ${ username }`);
    }
  }
  catch (error) {
    log.error(`[database]: edit user error ${ error.message }`);
    return {
      success: false,
      error,
    };
  }
};

const removeUser = async (username) => {
  try {
    const result = await User.deleteOne({ username: username });
    if (result.deleteCount === 1) {
      return {
        success: true,
      };
    }
    else {
      throw new Error(`no user with username ${ username }`);
    }
  }
  catch (error) {
    log.error(`[database]: remove user error: ${ error.message }`);
    return {
      success: false,
      error,
    };
  }
};

const getPostsByUser = async (username) => {
  try {
    const postIds = await User.findOne({ username: username }).posts.toArray();

    const posts = [];

    await asyncForEach(postIds, async (postId) => {
      const post = await Post.findOne({ _id: postId });
      posts.push(post);
    });

    return {
      success: true,
      posts,
    };
  }
  catch (error) {
    log.error(`[database]: get posts by user error: ${ error.message }`);
    return {
      success: false,
    };
  }
};

const getCommentsByUser = async (username) => {
  try {
    const commentIds = await User.findOne({ username: username }).comments.toArray();

    const comments = [];

    await asyncForEach(commentIds, async (commentId) => {
      const comment = Comment.findOne({ _id: commentId });
      comments.push(comment);
    });

    return {
      success: true,
      comments,
    };
  }
  catch (error) {
    log.error(`[database]: get comments by user error: ${ error.message }`);
    return {
      success: false,
    };
  }
};

const checkToken = async (data) => {
  try {
    const {
      username,
      token,
    } = data;
    const result = await User.findOne({ username: username, token: token });

    return {
      success: true && result,
    };

  }
  catch (error) {
    log.error(`[database]: check token error: ${ error.message }`);
    return {
      success: false,
    };
  }
};

//#endregion

//#region Posts

const newPostsColl = async () => {
  await db.createCollection('posts', {
    validator: postSchema,
  });
};

const createPostCollection = async () => {
  try {
    const shouldCreate = new Promise((resolve, reject) => {
      db.listCollections({ name: 'posts' })
        .next((err, collInfo) => {
          if (err) {
            reject({
              success: false,
              err,
            });
          }
          else if (!collInfo) {
            resolve({
              success: true,
            });
          }
          else {
            reject({
              success: false,
              err: 'collections exists',
            });
          }
        });
    });
    shouldCreate.then((result) => {
      if (result.success) {
        setTimeout(newPostsColl.bind(db, shouldCreate));
      }
    })
      .catch((result) => {
        log.error(`[database]: could not create posts collection ${result.err}`);
      });
  }
  catch (error) {
    log.error(`[database]: could not create posts collection ${error.message}`);
    return {
      success: false,
    };
  }
};
const addPost = async (post) => {
  try {
    post = {
      ...post,
      createdOn: new Date(Date.now()),
      edited: false,
    };
    
    console.log(post);

    const result = await Post.insertOne(post);

    if (result.insertedCount < 1) {
      throw new Error('could not insert new post');
    }
    else {
      return {
        success: true,
      };
    }
  }
  catch (error) {
    log.error(`[database]: error adding blog post: ${error.message}`);
    return {
      success: false,
      error,
    };
  }
};

const getPost = async (postId) => {
  try {
    const post = await Post.findOne({ _id: postId });

    return {
      success: true,
      post,
    };
  }
  catch (error) {
    log.error(`[database]: get post error: ${ error.message }`);
    return {
      success: false,
    };
  }
};

const getAllPosts = async () => {
  try {
    const posts = await Post.find({}).toArray();

    return {
      success: true,
      posts,
    };
  }
  catch (error) {
    log.error(`[database]: get all posts error: ${ error.message }`);
    return {
      success: false,
    };
  }
};

const editPost = async (data) => {
  try {
    const {
      postId,
      newPostData,
    } = data;
    const result = await Post.updateOne(
      { _id: postId },
      {
        $set: {
          ...newPostData,
        },
      },
    );

    if (result.matchedCount === 1) {
      return {
        success: result.modifiedCount ===1,
      };
    }
    else {
      throw new Error(`no post with id ${ postId }`);
    }
  }
  catch (error) {
    log.error(`[database]: edit post error: ${ error.message }`);
    return {
      success: false,
      error,
    };
  }
};

const removePost = async (postId) => {
  try {
    const result = await Post.deleteOne({ _id: postId });
    if (result.deleteCount === 1) {
      return {
        success: true,
      };
    }
    else {
      throw new Error(`no post with postId ${ postId }`);
    }
  }
  catch (error) {
    log.error(`[database]: remove post error: ${ error.message }`);
    return {
      success: false,
      error,
    };
  }
};

//#endregion

//#region Comments

const newCommentsColl = async () => {
  await db.createCollection('comments', {
    validator: commentSchema,
  });
};

const createCommentsCollection = async () => {
  try {
    const shouldCreate = new Promise((resolve, reject) => {
      db.listCollections({ name: 'comments' })
        .next((err, collInfo) => {
          if (err) {
            reject({
              success: false,
              err,
            });
          }
          else if (!collInfo) {
            resolve({
              success: true,
            });
          }
          else {
            reject({
              success: false,
              err: 'collections exists',
            });
          }
        });
    });
    shouldCreate.then((result) => {
      if (result.success) {
        setTimeout(newCommentsColl.bind(db, shouldCreate));
      }
    })
      .catch((result) => {
        log.error(`[database]: could not create posts collection ${result.err}`);
      });
  }
  catch (error) {
    log.error(`[database]: could not create posts collection ${error.message}`);
    return {
      success: false,
    };
  }
};

//#endregion

module.exports = {
  connectToDB,

  createUserCollection,
  getAllUsers,
  getUser,
  addUser,
  authUser,
  changePass,
  editUser,
  removeUser,
  getPostsByUser,
  getCommentsByUser,
  checkToken,

  createPostCollection,
  addPost,
  getPost,
  getAllPosts,
  editPost,
  removePost,

  createCommentsCollection,
};
