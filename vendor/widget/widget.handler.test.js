'use strict';

const { createOrder , packageDelivered } = require('./handler');

jest.mock('../../socket.js', () => {
  const emitMock = jest.fn(); // Create a mock function for 'emit'

  return {
    io: {
      connect: jest.fn().mockReturnValue({
        emit: emitMock, // Use the mock function for 'emit'
      }),
    },
  };
});

let consoleSpy;

beforeAll(() => {
  consoleSpy = jest.spyOn(console, 'log').mockImplementation();
});

afterAll(() => {
  consoleSpy.mockRestore();
});

describe('Widget handler tests', () => {

  //Chat GPT helped with line 31 to 41 with generating socket and payload and requiring the socket down here for connect
  let socket;
  let payload;
  beforeEach(() => {
    socket = require('../../socket.js').io.connect(); // Use the mock socket object
    payload = {
      store: 'test',
      orderID: 123,
      customer: 'customer',
      address: 'address',
    };
  });


  test('Can create an order payload', () => {
    createOrder(socket, payload);
    expect(consoleSpy).toHaveBeenCalledWith(`VENDOR: Order #:${payload.orderID} ready for pickup.`);
    expect(socket.emit).toHaveBeenCalledWith('pickup', payload);
  });

  test('Confirms delivery', () => {
    packageDelivered(payload);
    expect(consoleSpy).toHaveBeenCalledWith(`VENDOR: Thank you for your order ${payload.customer}`);
  });


});
