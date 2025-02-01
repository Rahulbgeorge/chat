import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { Server } from 'socket.io';
import { dirname, join } from 'node:path';

import { home, connect_socket } from './views.js';

const app = express();
const server = createServer(app);
export const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));


app.get('/', home);
io.on('connection', connect_socket(io));





server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});