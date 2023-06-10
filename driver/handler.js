'use strict';

const { io } =  require('socket.io-client');
const socket =  io('http://localhost:3001/caps');


//!! Purely created to be able to generate tests
const pickupOccurred = (payload) => {
  console.log('DRIVER: picked up', payload.orderID);
  socket.emit('in-transit', payload);
};

const packageDelivered = (payload) => {
  console.log('DRIVER: delivered', payload.orderID);
  socket.emit('delivered', payload);
};

module.exports = { pickupOccurred, packageDelivered };
