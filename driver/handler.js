'use strict';

// const { io } =  require('socket.io-client');
// const socket =  io('http://localhost:3001/caps');

const pickupOccurred = (payload, socket) => {
  console.log('DRIVER: picked up', payload.order.orderId);
  if(socket) {
    socket.emit('in-transit', payload);
  }
};

const packageDelivered = (payload, socket) => {
  console.log('DRIVER: delivered', payload.order.orderId);
  if(socket) {
    socket.emit('delivered', {...payload, event: 'delivered'});
  }
};

const handlePickupAndDelivered = (payload, socket) => {
  setTimeout(() => {
    pickupOccurred(payload, socket);
  }, 1000);
  setTimeout(() => {
    packageDelivered(payload, socket);
  }, 3000);
};

module.exports = { pickupOccurred, packageDelivered, handlePickupAndDelivered };
