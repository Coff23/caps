// 'use strict';

// const EventEmitter = require('events');
// const eventpool = new EventEmitter();

// require('./vendor');

// function logAllEvents(event, payload) {
//   const timestamp = new Date().toISOString();
//   console.log(`EVENT { event: '${event}', time: ${timestamp}, payload:\n`, payload, '}');
// }

// function registerListener(event) {
//   console.log(`Listening to '${event}' event`);
//   eventpool.on(event, (payload) => {
//     logAllEvents(event, payload);
//   });
// }

// function unregisterListener(event) {
//   console.log(`Stopped listening to '${event}' event`);
//   eventpool.off(event);
// }

// eventpool.on('newListener', (event) => {
//   if (event !== 'newListener' && event !== 'removeListener') {
//     registerListener(event);
//   }
// });

// eventpool.on('removeListener', (event) => {
//   if (event !== 'newListener' && event !== 'removeListener') {
//     unregisterListener(event);
//   }
// });

// module.exports = eventpool;
