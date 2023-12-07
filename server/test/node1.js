import {Node} from '../src/node.js'

const node1 = new Node('localhost', 3000, ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'], 3)
node1.run()