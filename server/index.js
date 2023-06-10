'use strict';

require('dotenv').config();
const { Server } = require('socket.io');
const PORT = process.env.PORT || 3002;
const Queue = require('./lib/queue');
let eventQueue = new Queue();
const server = new Server();
const caps = server.of('/caps');

caps.on('connection', (socket) => {
  console.log('Caps socket connection to server: ', socket.id);

  socket.on('JOIN', (room) => {
    console.log('Possible rooms -----', socket.adapter.rooms);
    console.log('Payload is in this room ----', room);
    socket.join(room);
  });

  socket.onAny((event, payload) => {
    const timestamp = new Date();
    console.log('EVENT: ', { event, timestamp, payload });
  });

  socket.on('pickup', (payload) => {
    let currentQueue = eventQueue.read('DRIVER');
    if (!currentQueue) {
      let queueKey = eventQueue.store('DRIVER', new Queue());
      currentQueue = eventQueue.read(queueKey);
    }

    currentQueue.store(payload.orderID, payload);

    socket.broadcast.emit('pickup', payload);
  });

  socket.on('in-transit', (payload) => {

    caps.emit('in-transit', payload);
  });

  socket.on('delivered', (payload) => {
    let currentQueue = eventQueue.read(payload.store);
    if (!currentQueue) {
      let queueKey = eventQueue.store(payload.store, new Queue());
      currentQueue = eventQueue.read(queueKey);
    }

    currentQueue.store(payload.orderID, payload);
    console.log('console log in the delivered socket.on at server', currentQueue);

    caps.emit('delivered', payload);
  });

  socket.on('received', (payload) => {
    let id = payload.queueId ? payload.queueId : payload.store;
    let currentQueue = eventQueue.read(id);
    if (!currentQueue) {
      throw new Error('No queue found for this store:', payload.store);
    }

    let order = currentQueue.remove(payload.orderID);
    socket.broadcast.emit('received', order);
  });

  socket.on('getAll', (payload) => {
    console.log('attempting to get all orders');
    let id = payload.queueId ? payload.queueId : payload.store;
    let currentQueue = eventQueue.read(id);
    if (currentQueue && currentQueue.data) {
      Object.keys(currentQueue.data).forEach(orderID => {
        socket.emit('pickup', currentQueue.read(orderID));
      });
    }
  });
});

server.listen(PORT);
