'use strict';

// const { io } =  require('socket.io-client');
// const socket =  io('http://localhost:3001/caps');
var Chance = require('chance');
var chance = new Chance();
const store = '1-206-flowers';

const orderHandler = (socket, order=null) => {
  if(!order){
    order = {
      store,
      orderId: chance.guid(),
      customer: chance.name(),
      address: chance.address(),
    };
  }

  let payload = {
    event: 'pickup',
    messageId: order.orderId,
    queueId: store,
    order,
  };

  socket.emit('pickup', payload);
};

const thankDriver = (payload) =>
  console.log('VENDOR: Thank you for your order', payload.order.customer);

const deliveredMessage = (payload) => {
  setTimeout(() => {
    thankDriver(payload);
  }, 1000);
};

module.exports = { orderHandler, deliveredMessage, thankDriver };

