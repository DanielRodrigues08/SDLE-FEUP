const Node = require('../src/node')
const node5 = new Node('localhost', 3004, ['http://localhost:3004', 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'], 3)
node5.run()