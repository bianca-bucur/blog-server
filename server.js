const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const controllers = require('./controllers');
const log = require('./utils/log');
const http = require('http');
const {
  startWSServer,
} = require('./modules/wsServer');
const process = require('process');
const {
  connectToDB,
  getAllUsers,
  createUserCollection,
  createPostCollection,
  addUser,
  addPost,
  getAllPosts,
  removePost,
  addComment,
  editPost,
  authUser,
  editComment,
  removeComment,
} = require('./modules/database');
const config = require('./config');

const {
  nodeServer: {
    ip,
    port,
  },
} = config;

const main = async () => {
  const dbOk = await connectToDB();
  if (!dbOk) {
    log.error('[main]: cannot continue');
    process.exit(-1);
  }

  startWSServer();


  const app = express();
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(cors());

  app.use(controllers);

  const httpServer = http.createServer(app);
  httpServer.listen(port, ip);

  await createUserCollection();
  await createPostCollection();
  await addUser({
    name: 'Jane Doe',
    username: 'user2',
    password: 'pass2',
    type: 'admin',
    createdOn: new Date(Date.now()),
  });
  await addPost({
    title:'test title1',
    author: 'user2',
    content:'test content',
    category: 'test',
    createdOn: new Date(Date.now()),
    comments: [{
      name: 'Jane Doe',
      username: 'user2',
      type: 'admin',
      title: 'test comment31',
      content: 'test comment content fdsjoifsdijfdssdfiajsdi',
      createdOn: new Date(Date.now()),
    }],
  });
  await addPost({
    title:'test title2',
    author: 'user2',
    content:'test content',
    category: 'test',
    createdOn: new Date(Date.now()),
    comments: [{
      name: 'Jane Doe',
      username: 'user2',
      type: 'admin',
      title: 'test comment1',
      content: 'test comment content',
      createdOn: new Date(Date.now()),
    }],
  });
  await addPost({
    title:'test title10',
    author: 'user2',
    content:'test content',
    category: 'test',
    createdOn: new Date(Date.now()),
  });
  await addComment('user2',
    {
      name: 'Jane Doe',
      username: 'user2',
      type: 'admin',
      title: 'test comment5',
      content: 'test comment content4',
      createdOn: new Date(Date.now()),
    },
    'test title10',
  );
  await addComment('user2',
    {
      name: 'Jane Doe',
      username: 'user2',
      type: 'admin',
      title: 'test comment1',
      content: 'test comment content4fdsafdsasa',
      createdOn: new Date(Date.now()),
    },
    'test title10',
  );
  await editComment('user2',
    {
      name: 'Jane Doe',
      username: 'user2',
      type: 'admin',
      title: 'test comment5',
      content: 'test comment content4 fdsjaofoisdaojiassadojfsadoj',
      createdOn: new Date(Date.now()),
    },
    'test title10',
    'test comment5',
  );
  await removeComment('test title10', 'test comment5');
  const users = await getAllUsers();
  const posts = await getAllPosts();
  if (users.data) {
    console.log(users.data);
  }
  if (posts.data) {
    console.log(posts.data);
  }
};

main();
