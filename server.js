const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const controllers = require('./controllers');
const log = require('./utils/log');
const config = require('./config');
const http = require('http');
const {
  startWSServer,
} = require('./modules/wsServer');
const process = require('process');
const {
  connectToDB,
  getAllUsers,
  // createUserCollection,
  // addUser,
  // authUser,
  // editUser,
} = require('./modules/database');

const {
  nodeServer: {
    ip,
    port,
  },
} = config;

const main = async () => {
  console.log('test');
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

  // await createUserCollection();
  // await addUser({
  //   name: 'Jane Doe',
  //   username: 'user1',
  //   password: 'pass1',
  //   type: 'admin',
  //   createdOn: new Date(Date.now()),
  // });
  await getAllUsers();
  // await authUser('user', 'pass2');
  // await editUser(
  //   {
  //     username: 'user3',
  //     newUserData:{
  //       name: 'Jane Doe',
  //       username: 'user2',
  //       password: 'pass2',
  //     // type: 'admin',
  //     // createdOn: new Date(Date.now()),
  //     },
  //   });
};

main();
