import express from "express";
import axios from "axios";
import { Node } from "./Node.js";
import cors from "cors";
import crypto from "crypto";

class Server {

    constructor(hostname, port, allNodes, protocol = "http") {

        this.host = hostname
        this.port = port
        this.address = `${protocol}://${hostname}:${port}`
        this.nodes = allNodes
        this.protocol = protocol

        this.server = express()
        this.server.use(cors())
        this.server.use(express.json())
        this.server.use(express.static('Users'));

    }

    run() {

        this.server.post('/postList', this.postList.bind(this))
        this.server.post('/addNode', this.addNode.bind(this))
        this.server.post('/removeNode', this.removeNode.bind(this))
        this.server.post('/pauseNode', this.pauseNode.bind(this))
        this.server.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}!`)
        })
    }

    async addNode(req, res) {
        const requestBody = req.body;
        const nodeHost = requestBody.host;
        const nodePort = requestBody.port;
        const numInstances = requestBody.numInstances;
        const node = `${this.protocol}://${nodeHost}:${nodePort}`
        const degree = requestBody.degree;
        try {
            new Node(nodeHost, nodePort, this.nodes, numInstances, this.protocol, degree).run();
            this.nodes.add(node);
            const response = await axios.post(`${node}/ring/gossip`, {
                node: node,
                action: "add",
                idAction: crypto.randomBytes(20).toString("hex")
            })
            res.status(200).json({ message: `Node ${node} added.` });
        }catch (error) {
            res.status(400).json({ message: `Could not add node ${node}.` })
        }
        res.end()
    }

    async removeNode(req, res) {
        const requestBody = req.body;
        const node = requestBody.address;

        try {
            const response = await axios.post(`${node}/shutdown`);
            this.nodes.delete(node)
            res.status(200).json(response.data);
        } catch (error) {
            res.status(400).json({ message: `Could not remove node ${node}.` })
        }
        res.end()
    }

    async pauseNode(req, res) {
        const requestBody = req.body;
        const node = requestBody.address;
        const time = requestBody.time;
        try {
            const response = await axios.post(`${node}/pause`, { time: time });
            res.status(200).json(response.data);
        } catch (error) {
            res.status(400).json({ message: `Could not pause node ${node}.` })
        }
        res.end()
    }

    async postList(req, res) {

        try {
            const requestBody = req.body;
            const requestId = requestBody.id;
            let list = {};
            for (const node of this.nodes) {
                try {
                    const response = await axios.post(`${node}/postList`, requestBody);
                    console.log(response.data.data.data);
                    res.status(200).json(response.data.data.data);
                    break;

                }
                catch (error) {
                    continue
                }

            }

        }
        catch (error) {
            console.error("Error posting data:", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
        finally {
            res.end()
        }
    }
}

export { Server };