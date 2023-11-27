const node = require('./Node')

function sleep(ms, callback) {
  setTimeout(callback, ms);
}


const nodesIps = [
    'http://localhost:4000',
    'http://localhost:4001',
    'http://localhost:4002',
    'http://localhost:4003',
    'http://localhost:4004',
    'http://localhost:4005',
]

const nodes = []
nodes.push(new node("localhost", 4000, nodesIps, 6, 5000))
nodes.push(new node("localhost", 4001, nodesIps, 6, 6000))
nodes.push(new node("localhost", 4002, nodesIps, 6, 7000))
nodes.push(new node("localhost", 4003, nodesIps, 6, 8000))
nodes.push(new node("localhost", 4004, nodesIps, 6, 9000))

for(const node of nodes){
    node.run()
}
