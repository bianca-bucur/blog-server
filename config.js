const enviromnet = 'dev';

const config = {
  nodeServer: {
    // NodeJS IP is always 0.0.0.0 regardless of the environment
    // aka don't change it
    ip: '0.0.0.0',
    port: '4000',
    protocol: 'http',
  },
  WSServerPort: 64000,
};

module.exports = config;