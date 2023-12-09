/*
const request = require('supertest');
const app = require('../src/node');

describe('Test /ring path', () => {
  it('It should response the GET method with 200 code', async () => {
    const response = await request(app).get('/ring');
    expect(response.statusCode).toBe(400);
  });
});
*/
import request from 'supertest';
import { Node } from '../node'; // adjust this path to your actual Node class file

describe('Node server', () => {
    let node;
    let server;

    beforeAll(() => {
        node = new Node('localhost', 3000, [], 1); // adjust these parameters to match your actual setup
        server = node.server;
        node.run(); // assuming you have a run method to start the server
    });

    afterAll(() => {
        server.close(); // assuming you have a close method to stop the server
    });

    test('GET /ring', async () => {
        const response = await request(server).get('/ring');
        expect(response.status).toEqual(200);
        // Add more assertions based on your expected response
    });
});
