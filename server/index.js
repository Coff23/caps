'use strict';

require('dotenv').config({ path: '../.env' });
const { Server } = require('socket.io');
const PORT = process.env.PORT || 3002;

const server = new Server();

const caps = server.of('/caps');

function logger(event, payload) {
  const timestamp = new Date();
  console.log('EVENT: ', { event, timestamp, payload });
}

server.on('connection', (socket) => {
  console.log('Server socket connection to event server: ', socket.id);
});

caps.on('connection', (socket) => {
  console.log('Caps socket connection to server: ', socket.id);

  socket.on('pickup', (payload) => {
    logger('pickup', payload);
    socket.broadcast.emit('pickup', payload);
  });

  socket.on('in-transit', (payload) => {
    logger('in-transit', payload);
    socket.broadcast.emit('in-transit', payload);
  });

  socket.on('delivered', (payload) => {
    logger('delivered', payload);
    socket.broadcast.emit('delivered', payload);
  });

});

server.listen(PORT);
