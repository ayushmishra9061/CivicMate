import http from 'http';
import { Server } from 'socket.io';
import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';
import { initSocket } from './services/socketService.js';

const start = async () => {
  await connectDatabase();
  const app = createApp();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: env.clientUrl.split(',').map((origin) => origin.trim()),
      credentials: true
    }
  });

  initSocket(io);

  server.listen(env.port, () => {
    console.log(`CivicMate API running on port ${env.port}`);
  });
};

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
