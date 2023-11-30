import express from "express";
import axios from "axios";
import {Node} from "./Node.js";

class Server {

    constructor(hostname, port, allNodes, protocol = "http") {

        this.host          = hostname
        this.port          = port
        this.address       = `${protocol}://${hostname}:${port}`
        this.nodes         = allNodes
        this.protocol      = protocol

        this.server = express()
        this.server.use(express.json())

    }

    run() {

        this.server.post('/postList', this.postList.bind(this))
        this.server.post('/shutdown', this.shutdown.bind(this))
        this.server.post('/addNode', this.addNode.bind(this))
        this.server.post('/removeNode', this.removeNode.bind(this))


        this.server.listen(this.port, () => {
            console.log(`Node listening on port ${this.port}!`)
        })
    }

    shutdown(req, res) {
        console.log('Initiating graceful shutdown...');
        this.server.listen().close(() => {
            console.log(`Server ${this.host}:${this.port} closed gracefully.`);
            res.status(200).json({message: `Server ${this.host}:${this.port} closed gracefully.`});
            process.exit(0);
        });
        res.end()
    }

    async addNode(req, res) {
        const requestBody = req.body;
        const nodeHost = requestBody.host;
        const nodePort = requestBody.port;
        const node      = `${this.protocol}://${nodeHost}:${nodePort}`
        this.nodes.add(node);
        
        new Node(nodeHost, nodePort, this.nodes, 3).run();

        for (const node of this.nodes) {
            await axios.post(`${node}/addNode`, {address: node});
        } 
        res.status(200).json({message: `Node ${node} added.`});
        res.end()
    }

    async removeNode(req, res) {
        const requestBody = req.body;
        const node = requestBody.address;
        axios.post(`${node}/shutdown`);
        this.nodes.remove(node);
        for (const node of allNodes) {
            await axios.post(`${node}/removeNode`, {address: node});
        }


        res.status(200).json({message: `Node ${node} removed.`});
        res.end()

    }

    async postList(req, res) {

        try {
            const requestBody = req.body;
            const requestId = requestBody.id;
            let list = {};
            for (const node of this.nodes) {
                try {
                    const response = axios.post(`${node}/postList`, requestBody);
                    res.status(200).json({message: `Data: ${response.data}`});
                    break;
                    
                }
                catch (error) {
                    continue
                }
            
            }

        }
        catch (error) {
            console.error("Error posting data:", error.message);
            res.status(500).json({error: "Internal Server Error"});
        }
        finally {
            res.end()
        }
    }
}

export {Server};