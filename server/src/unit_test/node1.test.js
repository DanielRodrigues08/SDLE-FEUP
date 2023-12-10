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

describe('Testing App Endpoints', () => {
  let node;
  let server;

  beforeAll(() => {
    node = new Node('localhost', 3000, [], 1); // adjust these parameters to match your actual setup
    server = node.server;
    node.run(); // assuming you have a run method to start the server
  });

  afterAll(() => {
    server.close();
  });

  test('GET /ring', async () => {
    const response = await request(server).get('/ring');
    expect(response.status).toEqual(200);

  });

  test('GET /ring/nodes', async () => {
    const response = await request(server).get('/ring/nodes');
    expect(response.status).toEqual(200);

  });

  test('Post /ring/gossip', async () => {
    const responseNodes = await request(server).get('/ring/nodes');
    const response = await request(server).post('/ring/gossip',{node:responseNodes.body.nodes,action:'add',idAction:'1234'});
    expect(response.status).toEqual(200);

  });

  test('Post /setNodes', async () => {
    const response = await request(server).post('/setNodes',{nodes:[
      {
        "address": "localhost",
        "port": 3000
      },
      {
        "address": "localhost",
        "port": 3001
      },
      {
        "address": "localhost",
        "port": 3002
      },
      {
        "address": "localhost",
        "port": 3003
      }
    ]});
    expect(response.status).toEqual(200);

  });

  test('Post /shutdown', async () => {
    const response = await request(server).post('/shutdown');
    expect(response.status).toEqual(200);

  });

  test('Post /postList', async () => {
    const response = await request(server).post('/postList',{list:[
      {
        "id": "1234"
  
      },
    ]});
    expect(response.status).toEqual(200);

  });

  test('Post /store', async () => {
    const response = await request(server).post('/store',{id:'1234'});
    expect(response.status).toEqual(200);

  });


});
