'use strict';

let eventEmitter = require('../eventpool');

const pickupOccurred = (payload) => {
  console.log('DRIVER: picked up', payload.orderId);
  eventEmitter.emit('in-transit', payload);
};

const packageDelivered = (payload) => {
  console.log('DRIVER: delivered', payload.orderId);
  eventEmitter.emit('delivered', payload);
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
