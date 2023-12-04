import {AWSet} from "crdts";
import {ConsistentHashing} from "./ConsistentHashing.js";

import express from "express";
import axios from "axios";
import fs from "fs";
import path from "path";
import crypto from "crypto";

class Node {
    constructor(hostname, port, allNodes, numInstances, protocol = "http", degreeGossip = 3) {
        this.host = hostname
        this.port = port
        this.neighboorhood = 3
        this.address = `${protocol}://${hostname}:${port}`
        this.consistentHashing = new ConsistentHashing(allNodes, numInstances)
        this.degreeGossip = degreeGossip
        this.gossipCounter = []

        this.server = express()
        this.server.use(express.json())
    }

    run() {

        this.server.get('/ring', this.getRing.bind(this))
        this.server.get('/ring/nodes', this.getNodesRing.bind(this))
        this.server.post('/ring/gossip', this.handleGossip.bind(this))
        this.server.post('/setNodes', this.setNodes.bind(this))
        this.server.post('/shutdown', this.shutdown.bind(this))

        this.server.post('/postList', this.postList.bind(this))
        this.server.post('/store', this.store.bind(this))

        this.server.listen(this.port, () => {
            console.log(`Node listening on port ${this.port}!`)
        })
    }

    getNodesRing(req, res) {
        res.json({nodes: JSON.stringify(this.consistentHashing.getNodes())})
    }

    handleGossip(req, res) {
        // TODO send the data to the nodes that are responsible for it
        let messageCounter = this.gossipCounter[req.body.idAction] ? this.gossipCounter[req.body.idAction] : 0;

        // The message has already been gossiped N times, so we can stop resending it
        if (messageCounter === this.degreeGossip) {
            res.end()
            return
        }
        // The message has not been gossiped yet, so we can process it
        else if (messageCounter === 0) {
            switch (req.body.action) {
                case "add":
                    this.consistentHashing.addNode(req.body.node)
                    break
                case "remove":
                    this.consistentHashing.removeNode(req.body.node)
                    break
                default:
                    res.status(400).json({message: "Invalid action"})
                    break
            }
        }

        res.end()
        // The gossipCounter will be responsible for counting the number of times the message has been gossiped by the node
        this.gossipCounter[req.body.idAction] = messageCounter + 1
        this._sendGossip(req.body.node, req.body.action, req.body.idAction)
    }

    shutdown(req, res) {
        console.log('Initiating graceful shutdown...');
        // TODO: Send the data to the nodes that are responsible for it

        this._sendGossip(this.address, "remove", crypto.randomBytes(20).toString("hex"))

        this.server.listen().close(() => {
            console.log(`Server ${this.host}:${this.port} closed gracefully.`);
            res.status(200).json({message: `Server ${this.host}:${this.port} closed gracefully.`});
            res.end()
        });
    }

    _sendGossip(targetNode, action, idAction) {
        let nodesToGossip = this._chooseRandomNodes(this.degreeGossip);

        for (const nodeToGossip of nodesToGossip) {
            // TODO: Check if the node is alive. If not choose another one
            axios.post(`${nodeToGossip}/ring/gossip`, {
                node: targetNode,
                action: action,
                idAction: idAction
            })
        }
    }

    _chooseRandomNodes(numNodes) {
        let nodes = this.consistentHashing.getNodes();

        nodes = nodes.filter(element => element !== this.address);
        if (numNodes > nodes.length) {
            return nodes
        }
        const randomNodes = [];
        let randomIndex;

        do {
            randomIndex = Math.floor(Math.random() * nodes.length);
            randomNodes.push(nodes[randomIndex])
            nodes.splice(randomIndex, 1)
        } while (randomNodes.length !== numNodes)

        return randomNodes;
    }

    getRing(req, res) {
        res.status(200).json(this.consistentHashing.getFormattedRingJSON())
        res.end()
    }


    async handoff() {

        console.log("HAND OFF")

        const sanitizedAddress = this.address.replace(/[:/]/g, '_'); // Replace colons and slashes with underscores
        const folderPath = path.join("data", sanitizedAddress, "handoff");

        if (!fs.existsSync(folderPath)) {
            return
        }

        const files = fs.readdirSync(folderPath);

        for (const file of files) {

            let canDelete = true;
            const filePath = path.join(folderPath, file);
            const fileData = JSON.parse(fs.readFileSync(filePath).toString());
            const requestId = fileData.id;
            const targetNodes = this.consistentHashing.getNode(requestId).slice(0, this.neighboorhood);

            for (const node of targetNodes) {

                if (node === this.address) {
                    continue;
                }

                console.log(`Forwarding request to ${node}`);
                const response = await axios.post(`${node}/store`, fileData)
                if (response.status !== 200) {
                    canDelete = false;
                }
            }

            if (canDelete) {
                fs.unlinkSync(filePath);
            }
        }

    }


    store(req) {

        const requestBody = req.body;
        const requestId = requestBody.id;
        const targetNodes = this.consistentHashing.getNode(requestId).slice(0, this.neighboorhood);


        const sanitizedAddress = this.address.replace(/[:/]/g, '_'); // Replace colons and slashes with underscores
        let folderPath = path.join("data", sanitizedAddress);

        if (!targetNodes.includes(this.address)) {
            folderPath = path.join(folderPath, "handoff");
        }

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, {recursive: true}); // Use a recursive option to create parent directories if they don't exist
        }

        const filePath = path.join(folderPath, `${requestId}.json`);
        fs.writeFileSync(filePath, JSON.stringify(requestBody));
        return requestBody;

    }


    postList(req, res) {

        const requestBody = req.body;
        const requestId = requestBody.id;
        const preferenceList = this.consistentHashing.getNode(requestId, this.neighboorhood);
        let lists = [];
        let list = {};

        let i = 0
        while (i < this.neighboorhood && i < preferenceList.length) {
            let node = preferenceList[i];
            try {
                if (node === this.address) {
                    list = this.store(req);

                } else {
                    console.log(`Forwarding request to ${node}`);
                    list = axios.post(`${node}/store`, requestBody);
                }
                if (list != null)
                    lists.push(list);
                i += 1;
            } catch (error) {
                i += 1
            }
        }

        res.status(200).json({message: `\n Posted to Server and its neighbors!`, data: JSON.stringify(lists[0])});
        res.end()

    }

    setNodes(req, res) {
        const nodes = req.body.nodes
        this.consistentHashing = new ConsistentHashing(nodes, 4)
    }
}

export {Node};