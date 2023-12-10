
import {Node} from "../src/Node.js";



const receivedParameters = process.argv.slice(2);


const nodeHost      = receivedParameters[0]
const nodePort      = receivedParameters[1]
const numInstances  = receivedParameters[2]
const nodes         = new Set(JSON.parse(receivedParameters[3]))
const degree        = receivedParameters[4]
const protocol      = receivedParameters[5]


new Node(nodeHost, nodePort, nodes, numInstances, protocol, degree).run();



