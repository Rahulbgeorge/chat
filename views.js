import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {io} from './index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function home(req, res)
{
    res.sendFile(join(__dirname, 'index.html'));
}

export function connect_socket(io)
 {
    return (socket) => {

        socket.on('chat message', (msg) => {
            console.log('message: ' + msg);
          });
    
        console.log('a user connected');
        socket.on('disconnect', () => {
          console.log('user disconnected');
        });

    }
    
  }

export function sendMessage(req, res)
{
    
}



export function io_handler(io, func)
{
    return 
}