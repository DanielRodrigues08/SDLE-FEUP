// Filename: create_servers.js

import {Server} from "../src/server.js";
import axios from "axios";

const server1 = new Server("localhost", 3000, new Set(), new Set(["http://localhost:3000", "http://localhost:3001"]));
const server2 = new Server("localhost", 3001, new Set(), new Set(["http://localhost:3000", "http://localhost:3001"]));

await server1.run();
await server2.run();


for (let i = 1; i <= 5; i++) {
    await axios.post("http://localhost:3000/addNode", {host: "localhost", port: 4000 + i, numInstances: 3, degree: 3});
}

server2.nodes = new Set(["http://localhost:4001", "http://localhost:4002", "http://localhost:4003", "http://localhost:4004", "http://localhost:4005"]);

axios.post("http://localhost:4001/setNodes", {nodes: ["http://localhost:4001", "http://localhost:4002", "http://localhost:4003", "http://localhost:4004", "http://localhost:4005"]});
axios.post("http://localhost:4002/setNodes", {nodes: ["http://localhost:4001", "http://localhost:4002", "http://localhost:4003", "http://localhost:4004", "http://localhost:4005"]});
axios.post("http://localhost:4003/setNodes", {nodes: ["http://localhost:4001", "http://localhost:4002", "http://localhost:4003", "http://localhost:4004", "http://localhost:4005"]});
axios.post("http://localhost:4004/setNodes", {nodes: ["http://localhost:4001", "http://localhost:4002", "http://localhost:4003", "http://localhost:4004", "http://localhost:4005"]});
axios.post("http://localhost:4005/setNodes", {nodes: ["http://localhost:4001", "http://localhost:4002", "http://localhost:4003", "http://localhost:4004", "http://localhost:4005"]});

console.log("Servers created and running.");

console.log(server1.nodes)
console.log(server2.nodes)