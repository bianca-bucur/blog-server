const express = require('express');
const cors = require('cors');
const cofing = require('./config');
const bodyParser = require('body-parser');
const controllers = require('./controllers');
const log = require('./utils/log');
const http = require('http');
const {
  startWSServer
} = require('./modules/wsServer');
const process = require('process');
const { connectToDB } = require('./modules/database');
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
};

main();