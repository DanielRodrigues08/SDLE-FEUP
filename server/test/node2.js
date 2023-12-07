import {Node} from '../src/node.js'

const node2 = new Node('localhost', 3001, ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'], 3)
node2.run()
