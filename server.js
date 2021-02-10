const express = require('express');
const cors = require('cors');
const cofing = require('./config');
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
    title:'test title',
    author: 'user2',
    content:'test content',
    category: 'test',
    createdOn: new Date(Date.now()),
  });
  await getAllUsers();
};

main();
