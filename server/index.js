'use strict';

require('dotenv').config();
const { Server } = require('socket.io');
const PORT = process.env.PORT || 3002;

const server = new Server();

server.listen(PORT);

server.on('connection', (socket) => {
  console.log('connected to the event server', socket.id);

  socket.on('MESSAGE', (payload) => {
    console.log('SERVER: Message event', payload);

    socket.broadcast.emit('MESSAGE', payload);
  });

  socket.on('RECEIVED', (payload) => {
    console.log('SERVER: Received event', payload);

    socket.broadcast.emit('RECIEVED', payload);
  });
});
