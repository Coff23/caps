'use strict';

require('dotenv').config({ path: '../.env' });
const { Server } = require('socket.io');
const PORT = process.env.PORT || 3002;
const Queue = require('./lib/queue');
const messageQueue = new Queue;

const server = new Server();

server.listen(PORT);

const caps = server.of('/caps');

function logger(event, payload) {
  const timestamp = new Date();
  console.log('EVENT: ', { event, timestamp, payload });
}

caps.on('connection', (socket) => {
  console.log('Server socket connection to event server: ', socket.id);
  socket.onAny((event, payload) => {
    logger(event, payload);
  });

  socket.on('pickup', (payload) => {
    let currentQueue = messageQueue.read('DRIVER');
    if(!currentQueue){
      let queueKey = messageQueue.store('DRIVER', new Queue());
      currentQueue = messageQueue.read(queueKey);
    }
    currentQueue.store(payload.messageId, payload);
    socket.broadcast.emit('pickup', payload);
  });

  socket.on('received', (payload) => {
    let currentQueue = messageQueue.read(payload.queueId);
    if(!currentQueue) {
      throw new Error('we have a message but no queue');
    }
    let order = currentQueue.remove(payload.messageId);
    socket.broadcast.emit('received', order);
  });

  socket.on('in-transit', (payload) => {
    socket.broadcast.emit('in-transit', payload);
  });

  socket.on('delivered', (payload) => {
    let currentQueue = messageQueue.read(payload.store);
    if(!currentQueue) {
      let queueKey = messageQueue.store(payload.store, new Queue());
      currentQueue = messageQueue.read(queueKey);
    }
    currentQueue.store(payload.store, payload);
    socket.broadcast.emit('delivered', payload);
  });

  socket.on('getAll', (payload) => {
    let currentQueue = messageQueue.read(payload.queueId);
    if(currentQueue && currentQueue.data) {
      Object.keys(currentQueue.data).forEach(orderId => {
        socket.emit('pickup', currentQueue.read(orderId));
      });
    }
  });
});

// caps.on('connection', (socket) => {
//   console.log('Caps socket connection to server: ', socket.id);

//   socket.on('pickup', (payload) => {
//     logger('pickup', payload);
//     socket.broadcast.emit('pickup', payload);
//   });

//   socket.on('in-transit', (payload) => {
//     logger('in-transit', payload);
//     socket.broadcast.emit('in-transit', payload);
//   });

//   socket.on('delivered', (payload) => {
//     logger('delivered', payload);
//     socket.broadcast.emit('delivered', payload);
//   });

// });

