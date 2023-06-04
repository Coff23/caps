'use strict';

const { io } =  require('socket.io-client');
const socket =  io('http://localhost:3001/caps');
const { handlePickupAndDelivered } = require('./handler');

socket.emit('getAll', {queueId: 'driver'});

socket.on('pickup', handlePickupAndDelivered);
