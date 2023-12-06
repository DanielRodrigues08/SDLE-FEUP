const Node = require('../src/node')
const node3 = new Node('localhost', 3002, ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'], 3)
node3.run()