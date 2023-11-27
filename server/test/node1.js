const Node = require('../src/node')

const node1 = new Node('localhost', 3000, ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'], 3)
node1.run()