const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const controllers = require('./controllers');
const log = require('./utils/log');
const config = require('./config');
const http = require('http');
const process = require('process');

const {
  startWSServer,
} = require('./modules/wsServer');

const {
  connectToDB,
  getAllUsers,
  // createCommentsCollection,
  createPostCollection,
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

let httpServer;

const main = async () => {
  console.log('testing');
  const dbOk = await connectToDB();

  process.on('exit', () => {
    log.write('bye');
  });

  const handleSignal = (signal) => {
    log.warn(`[main]: handleSignal received ${ signal } -> trying to gracefully shutdown...`);
    httpServer.close((err) => {
      log.warn('[main]: closing http server...');
      process.exit(err ? 1 : 0);
    });
    // process.exit(0);
  };

  process.on('SIGINT', handleSignal);
  process.on('SIGTERM', handleSignal);

  process.on('unhandledRejection', (reason, promise) => {
    log.error(`UNHANDLED REJECTION ${promise} -> ${reason}`);
  });

  process.on('uncaughtException', (exception, origin) => {
    log.error(`UNCAUGHT EXCEPTION ${exception} -> ${origin}`);
  });

  if (!dbOk) {
    log.error('[main]: cannot continue');
    process.exit(-1);
  }

  const app = express();
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(cors());

  app.use(controllers);

  httpServer = http.createServer(app);
  httpServer.listen(port, ip);

  // await createUserCollection();
  // await createCommentsCollection();
  await createPostCollection();
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
  
 
};

main();
