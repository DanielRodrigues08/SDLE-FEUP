const Node = require('../src/node')

const node2 = new Node('localhost', 3001, ['http://localhost:3001', 'http://localhost:3000', 'http://localhost:3002', 'http://localhost:3005'], 3)
node2.run()
