import 'dotenv/config';

import sequelize from './config/database.js';
import app from './app.js';
import './models/index.js';
import { initilizeWebSocket } from './websocket/webSocketServer.js';

import http from 'node:http';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();

    console.log('Database connected successfully');

    const server = http.createServer(app);
    initilizeWebSocket(server);

    server.listen(PORT, () => {
      console.log(`HTTP server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
