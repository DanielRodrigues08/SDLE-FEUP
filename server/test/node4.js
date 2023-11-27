const Node = require('../src/node')
const node3 = new Node('localhost', 3003, ['http://localhost:3003', 'http://localhost:3005', 'http://localhost:3006'], 3)
node3.run()