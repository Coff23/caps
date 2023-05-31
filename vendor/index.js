'use strict';

let eventpool = require('../eventpool');

const Chance = require('chance');

const chance = new Chance();

function simulatePickup() {
  const payload = {
    store: chance.company(),
    orderId: chance.guid(),
    customer: chance.name(),
    address: chance.address(),
  };

  console.log(`EVENT { event: 'pickup', time: ${new Date().toISOString()}, payload:\n`, payload, '}');
  console.log(`DRIVER: picked up ${payload.orderId}`);

  setTimeout(() => {
    console.log(`EVENT { event: 'in-transit', time: ${new Date().toISOString()}, payload:\n`, payload, '}');
    console.log(`DRIVER: delivered ${payload.orderId}`);
    console.log(`VENDOR: Thank you for delivering ${payload.orderId}`);
    eventpool.emit('delivered', payload);
  }, 1000);
}

eventpool.on('delivered', (payload) => {
  console.log(`EVENT { event: 'delivered', time: ${new Date().toISOString()}, payload:\n`, payload, '}');
});

setInterval(simulatePickup, 5000);

module.exports = { simulatePickup };
