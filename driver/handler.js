'use strict';

// const { io } =  require('socket.io-client');
// const socket =  io('http://localhost:3001/caps');

const pickupOccurred = (payload, socket) => {
  console.log('DRIVER: picked up', payload.orderId);
  socket.emit('in-transit', payload);
};

const packageDelivered = (payload, socket) => {
  console.log('DRIVER: delivered', payload.orderId);
  socket.emit('delivered', payload);
};

const handlePickupAndDelivered = (payload) => {
  setTimeout(() => {
    pickupOccurred(payload);
  }, 1000);
  setTimeout(() => {
    packageDelivered(payload);
  }, 2000);
};

module.exports = { pickupOccurred, packageDelivered, handlePickupAndDelivered };
