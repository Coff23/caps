'use strict';

const eventpool = require('../eventpool');

eventpool.on('pickup', (payload) => {
  console.log('DRIVER: picked up', payload.orderId);
  eventpool.emit('in-transit', payload);
  console.log('DRIVER: emitted in-transit event for', payload.orderId);
  setTimeout(() => {
    eventpool.emit('delivered', payload);
    console.log('DRIVER: emitted delivered event for', payload.orderId);
  }, 1000);
});
