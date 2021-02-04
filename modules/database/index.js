const {MongoClient} = require('mongodb');
const bcrypt = require('bcrypt');
const log = require('../../utils/log');
const { customAlphabet } = require('nanoid');

const userSchema = require('./schemas/userSchema');
// const User = require('./models/users');
// const Post = require('./models/blogPost');

let db = null;
let User = null;
const Post = null;

const client = new MongoClient('mongodb://localhost/blog', {
  useUnifiedTopology: true,
});

const connectToDB = async () => {
  try {
    await client.connect();
    db = client.db('blog');
    User = db.collection('users');
    console.log('connected to db');
    return true;
  }
  catch (error) {
    log.error(`[database]: ${error.message}`);
    return false;
  }
};

//#region Users

const createUserCollection = async () => {
  try {
    const collectionExists = await db.getCollection('users').exists();
    console.log('collection:', collectionExists);
    // if (!collectionExists) {
    //   await db.createCollection('users', {
    //     validator: userSchema,
    //   });
    // }
  }
  catch (error) {
    log.error('[database]: could not create user collection');
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
      console.log(password);
      const hash = await bcrypt.hash(password, saltRounds);
      if (!hash) {
        throw new Error('[database]: could not create hash');
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
          throw new Error('[database]: could not insert new user');
        }
        return {
          success: true,
        };
      }
    }
  }
  catch (error) {
    log.error(`[database]: add user error: ${error.message}`);
  }
};

const getAllUsers = async () => {
  const users = User.find({});
  if ((await users.count() === 0)) {
    console.log('no users');
  }
  else {
    users.forEach(user => {
      console.log(user);
    });
  }
};


//#endregion

//#region Users

// const addUser = async (name, password, type) => {
//   try {
//     const userExists = await User.findOne({ username: name });
//     if (!userExists) {
//       const saltRounds = 10;
//       const hash = await bcrypt.hash(password, saltRounds);
//       if (!hash) {
//         throw new Error('could not create hash');
//       }
//       else {
//         const user = new User({
//           username: name,
//           password: hash,
//           type,
//           token: '',
//         });

//         user.save().catch((error) => { throw new Error(error); });
//         return {
//           success: true,
//         };
//       }
//     }
//     else {
//       throw new Error('username already exists');
//     }
//   }
//   catch (error) {
//     log.error(`[database]: add user error: ${error.message}`);
//   }
// };

// const authUser = async (name, password) => {
//   try {
//     const user = await User.findOne({ username: name });
//     if (user) {
//       const getToken = () => {
//         const alphabet = '1234567890abcdefghijklmnopqrstuvwxyz!@#$%^&*(){}][<>,.~';
//         const nanoid = customAlphabet(alphabet, alphabet.length);
//         return nanoid();
//       };

//       const result = await bcrypt.compare(password, user.password);

//       if (result) {
//         const authToken = getToken();
//         user.token = authToken;
//         await user.save();
//         return {
//           success: true,
//           token: user.token,
//           type: user.type,
//         };
//       }
//       else {
//         throw new Error(`password for ${name} does not match ${password}`);
//       }
//     }
//     else {
//       throw new Error(`user ${name} does not exist`);
//     }
//   }
//   catch (error) {
//     log.error(`[database]: user authentification error: ${error.message}`);
//     return {
//       success: false,
//       error,
//     };
//   }
// };

// const getUser = async (name) => {
//   try {
//     const user = await User.findOne({ name });
//     return user;
//   }
//   catch (error) {
//     log.error(`[database]: get user error: ${error.message}`);
//     return false;
//   }
// }

// const getAllUsers = async () => {
//   try {
//     const users = await User.find({});
//     return {
//       success: true,
//       users,
//     }
//   }
//   catch (error) {
//     log.error(`[database]: get all users error: ${error.message}`);
//     return {
//       sucess: false,
//       error,
//     }
//   }
// }

// const editUser = async (name, newUserData) => {
//   try {
//     const user = await User.findOne({ name });
//     if (user) {
//       const result = await User.updateOne({ name }, newUserData);
//       return {
//         success: result.nModified === 1,
//       };
//     }
//     else {
//       throw new Error('no such user');
//     }
//   }
//   catch (error) {
//     log.error(`[database]: edit user error ${error.message}`);
//     return {
//       success: false,
//       error,
//     };
//   }
// };

// const removeUser = async (name) => {
//   try {
//     const result = await User.deleteOne({ name });
//     return {
//       success: result && true,
//     };
//   }
//   catch (error) {
//     log.error(`[database]: remove user error: ${error.message}`);
//     return {
//       success: false,
//       error,
//     };
//   }
// };

// //#endregion

// //#region Posts

// const addPost = async (post) => {
//   try {
//     const {
//       content,
//       title,
//       author,
//       category,
//     } = post;
//     const blogPost = new Post({
//       content,
//       title,
//       author,
//       category,
//       timeStamp: new Date(Date.now()),
//       comments: [],
//     });
//     blogPost.save().catch((error) => {
//       throw new Error(error);
//     });
//     return {
//       success: true,
//     };
//   }
//   catch (error) {
//     log.error(`[database]: error adding blog post: ${error.message}`);
//     return {
//       success: false,
//       error,
//     };
//   }
// };

// const editPost = async (title, newPost) => {
//   try {
//     const post = await Post.findOne({ title });
//     if (post) {
//       const result = await Post.updateOne({ title }, newPost);
//       return {
//         success: result.nModified === 1,
//       };
//     }
//     else {
//       throw new Error('no such post');
//     }
//   }
//   catch (error) {
//     log.error(`[database]: edit post error: ${error.message}`);
//     return {
//       success: false,
//       error,
//     };
//   }
// };

// const removePost = async (title) => {
//   try {
//     const result = await Post.deleteOne({ title });
//     return {
//       success: result && true,
//     }
//   }
//   catch (error) {
//     log.error(`[database]: remove post error: ${error.message}`);
//     return {
//       success: false,
//       error,
//     };
//   }
// };

// const getPost = async (title) => {
//   try {
//     const post = await Post.findOne({ title });
//     return post;
//   }
//   catch(error) {
//     log.error(`[database]: get one post error: ${error.message}`);
//     return false;
//   }
// }

// const getAllPosts = async () => {
//   try {
//     const posts = await Post.find({});
//     return {
//       success: true,
//       data: posts,
//     };
//   }
//   catch (error) {
//     log.error(`[database]: get posts error: ${error.message}`);
//     return {
//       success: false,
//       error,
//     }
//   }
// }

//#endregion

module.exports = {
  connectToDB,
  createUserCollection,
  getAllUsers,
  addUser,
  // authUser,
  // getUser,
  // editUser,
  // removeUser,
  // addPost,
  // editPost,
  // removePost,
  // getPost,
  // getAllPosts,
};
