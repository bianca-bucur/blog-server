const WebSocket = require('ws');
const http = require('http');
const log = require('../utils/log');
const config = require('../config');

const {
  WSServerPort,
} = config;

let clients = [];

let WSServer;

function heartbeat() {
  this.isAlive = true;
}

const startWSServer = () => {
  const server = http.createServer();

  WSServer = new WebSocket.Server({ noServer: true });

  server.on('upgrade', (req, socket, head) => {
    WSServer.handleUpgrade(req, socket, head, (ws) => {
      WSServer.emit('connection', ws, req);
    });
  });

  WSServer.on('connection', (socket, request) => {
    log.write(`[WSServer]: connection from: ${request.connection.remoteAddress}`);
    socket.isAlive = true;

    socket.on('pong', heartbeat);

    socket.on('close', (code, message) => {
      log.warn(`[WSServer]: client said ${code}: ${message} and left`);
      const clientIndex = clients.findIndex(c => c === socket);
      clients = [...clients.slice(0, clientIndex, ...clients.slice(clientIndex + 1, clients.length))];
      log.write(`[WSServer]: clients number: ${clients.length}`);
    });

    socket.on('error', (err) => {
      log.err(`[WSServer]: socket error: ${err}`);
      const clientIndex = clients.findIndex(c => c === socket);
      clients = [...clients.slice(0, clientIndex, ...clients.slice(clientIndex + 1, clients.length))];
      log.write(`[WSServer]: clients number: ${clients.length}`);
    });

    // socket.on('message', (data) => {
      
    // })

    clients.push(socket);
    log.write(`[WSServer]: clients number: ${clients.length}`);
  });

  WSServer.on('error', (err) => {
    log.error(`[WSServer]: error: ${err}`);
  });

  WSServer.on('close', () => {
    log.warn('[WSServer]: closing server');
    clients.forEach((client) => {
      client.terminate();
    });
    clients = null;
    clearInterval(interval);
  });

  const interval = setInterval(() => {
    if (clients.length < 1) {
      return;
    }

    clients.forEach((client) => {
      if (!client.isAlive) {
        log.warn('[WSServer]: client gone');
        client.terminate();
        const clientIndex = clients.findIndex(c => c === client);
        clients = [...clients.slice(0, clientIndex), ...clients.slice(clientIndex + 1, clients.length)];
        log.write(`[wsserver]: clients number: ${clients.length}`);
        return;
      }

      client.isAlive = false;
      client.ping('');
    });
  }, 10000);

  server.listen(WSServerPort, '0.0.0.0');
};

const sendDataToUI = (data) => {
  if (clients.length > 0) {
    clients.forEach((client) => {
      client.send(data);
    });
  }
};

const closeWSServer = () => {
  sendDataToUI('[WSServer]: closing. bye!');
  WSServer.close();
};

module.exports = {
  startWSServer,
  sendDataToUI,
  closeWSServer,
  clients,
  WSServer,
};


