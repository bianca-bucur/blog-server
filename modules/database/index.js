const {MongoClient} = require('mongodb');
const bcrypt = require('bcrypt');
const log = require('../../utils/log');
const { customAlphabet } = require('nanoid');

const userSchema = require('./schemas/userSchema');
const postSchema = require('./schemas/postSchema');
// const User = require('./models/users');
// const Post = require('./models/blogPost');

var db = null;
let User = null;
let Post = null;

const client = new MongoClient('mongodb://localhost/blog', {
  useUnifiedTopology: true,
});

const connectToDB = async () => {
  try {
    await client.connect();
    db = client.db('blog');
    User = db.collection('users');
    Post = db.collection('posts');
    console.log('connected to db');
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

const getAllUsers = async () => {
  try {

    const users = await User.find({}).toArray();
    if ((users.length === 0)) {
      throw new Error('no users');
    }
    else {
      return {
        success: true,
        data: users,
      };
    }
  }
  catch (error) {
    log.error(`[database]: get all users error: ${error.message}`);
    return {
      success: false,
      error,
    };
  }
};

const authUser = async (username, password) => {
  try {
    const user = await User.findOne({username: username});
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
        await User.updateOne({username: username}, {
          $set: {
            token: authToken,
          },
        });
        return {
          success: true,
          token: user.token,
          type: user.type,
        };
      }
      else {
        throw new Error(`password for ${username} does not match ${password}`);
      }
    }
    else {
      throw new Error(`user ${username} does not exist`);
    }
  }
  catch (error) {
    log.write(`[database]: auth user error: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
};

const checkToken = async (username, token) => {
  try {
    const user = await User.findOne({ username: username });
    if (user) {
      return {
        tokenOk: user.token === token,
        userType: user.type,
      };
    }
    else {
      throw new Error(`no such user ${username}`);
    }
  }
  catch (error) {
    log.write(`[database]: check token error: ${error.message}`);
    return {
      tokenOk: false,
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
      createdOn,
    } = newUser;
    const userExists = await User.findOne({ username });
    if (!userExists) {
      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);
      if (!hash) {
        throw new Error('could not create hash');
      }
      else {
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
  }
  catch (error) {
    log.error(`[database]: add user error: ${error.message}`);
    return {
      success: false,
      error,
    };
  }
};

const removeUser = async (username) => {
  try {
    const result = await User.deleteOne({ username });
    if (result.deletedCount === 1) {
      return {
        success: true,
      };
    }
    else {
      throw new Error('no such user');
    }
  }
  catch (error) {
    log.error(`[database]: remove user error: ${error.message}`);
    return {
      success: false,
      error,
    };
  }
};

const editUser = async (username, editedUser) => {
  try {
    const result = await User.updateOne(username, { $set: editedUser });
    if (result.matchedCount !== 0) {
      return {
        success: true,
      };
    }
    else {
      throw new Error('no such user');
    }
  }
  catch (error) {
    log.error(`[database]: edit user error: ${error.message}`);
    return {
      success: false,
      error,
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
          console.log('a');
          if (err) {
            console.log('b');

            reject({
              success: false,
              err,
            });
          }
          else if (!collInfo) {
            console.log('c');

            resolve({
              success: true,
            });
          }
          else {
            console.log('d');

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

const getAllPosts = async () => {
  try {
    const posts = await Post.find().toArray();
    if ((posts.length === 0)) {
      throw new Error('no posts');
    }
    else {
      return {
        success: true,
        data: posts,
      };
    }
  }
  catch (error) {
    log.error(`[database]: get all posts error: ${error.message}`);
    return {
      success: false,
      error,
    };
  }
};

const addPost = async (newPost) => {
  try {
    const {
      title,
      author,
    } = newPost;
    const userExists = await User.findOne({ username: author });
    if (userExists) {
      const postExists = await Post.findOne({ title });
      if (!postExists) {
        const result = await Post.insertOne(newPost);

        if (result.insertedCount < 1) {
          throw new Error('[database]: could not insert new post');
        }
        return {
          success: true,
        };
      }
      else {
        throw new Error(`post with title '${title}' already exists`);
      }
    }
    else {
      throw new Error('author is not a registered user');
    }
  }
  catch (error) {
    log.error(`[database]: add post error: ${error.message}`);
    return {
      success: false,
      error,
    };
  }
};

const removePost = async (title) => {
  try {
    const result = await Post.deleteOne(title);
    if (result.deletedCount === 1) {
      return {
        success: true,
      };
    }
    else {
      throw new Error(`no such post with title '${title.title}'`);
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

const editPost = async (title, editedPost) => {
  try {
    const result = await Post.updateOne(title, { $set: editedPost });
    if (result.matchedCount !== 0) {
      return {
        success: true,
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


//#endregion

//#region Comments

const addComment = async (author, comment, title) => {
  try {
    const userExists = await User.findOne({ username: author });
    if (userExists) {
      const postExists = await Post.findOne({title: title});
      const updateDocument = {
        $push: {
          'comments': comment,
        },
      };
      if (postExists) {
        console.log(postExists);
        const result = await Post.updateOne( {title: title}, updateDocument);
        if (result.matchedCount !== 0) {
          return {
            success: true,
          };
        }
        else {
          throw new Error('no such post');
        }
      }
      else {
        throw new Error(`no post with title '${title}'`);
      }
    }
    else {
      throw new Error(`no user with name '${author}' exists`);
    }
  }
  catch (error) {
    log.error(`[database]: add comment error: ${error.message}`);
    return {
      success: false,
      error,
    };
  }
};

const editComment = async (author, comment, title, commentTitle) => {
  try {
    const userExists = await User.findOne({ username: author });
    if (userExists) {
      const postExists = await Post.findOne({title: title});
      const updateDocument = {
        $set: {
          'comments.$[]': comment,
        },
      };
      console.log(updateDocument);
      if (postExists) {
        const result = await Post.updateOne({
          title: title,
          'comments.title': commentTitle,
        },
        updateDocument);
        if (result.matchedCount !== 0) {
          return {
            success: true,
          };
        }
        else {
          throw new Error('no such post');
        }
      }
      else {
        throw new Error(`no post with title '${title}'`);
      }
    }
    else {
      throw new Error(`no user with name '${author}' exists`);
    }
  }
  catch (error) {
    log.error(`[database]: edit comment error: ${error.message}`);
    return {
      success: false,
      error,
    };
  }
};

const removeComment = async (title, commentTitle) => {
  try {
    const result = await Post.updateOne({title: title }, { $pull: { 'comments.$[].title': {title: commentTitle} }});
    console.log(result);
  }
  catch (error) {
    log.error(`[database]: remove comment error: ${error.message}`);
    return {
      success: false,
      error,
    };
  }
};

//#endregion

module.exports = {
  connectToDB,
  createUserCollection,
  getAllUsers,
  authUser,
  checkToken,
  addUser,
  removeUser,
  editUser,
  createPostCollection,
  addPost,
  getAllPosts,
  removePost,
  editPost,
  addComment,
  editComment,
  removeComment,
};
