import { BAWMap } from "crdts";
import { ConsistentHashing } from "./ConsistentHashing.js";

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
        this.server.post('/store', this.storeEndpoint.bind(this))

        this.server.listen(this.port, () => {
            setInterval(this.handoff.bind(this), 10000);
            console.log(`Node listening on port ${this.port}!`)
        })
    }

    getNodesRing(req, res) {
        res.json({ nodes: JSON.stringify(this.consistentHashing.getNodes()) })
    }

    handleGossip(req, res) {

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
                    res.status(400).json({ message: "Invalid action" })
                    break
            }
        }

        res.end()
        // The gossipCounter will be responsible for counting the number of times the message has been gossiped by the node
        this.gossipCounter[req.body.idAction] = messageCounter + 1
        this._sendGossip(req.body.node, req.body.action, req.body.idAction)
    }

    shutdown(res) {
        console.log('Initiating graceful shutdown...');

        this.moveToHandOff();
        this.handoff();
        this._sendGossip(this.address, "remove", crypto.randomBytes(20).toString("hex"))

        this.server.listen().close(() => {
            console.log(`Server ${this.host}:${this.port} closed gracefully.`);
            res.status(200).json({ message: `Server ${this.host}:${this.port} closed gracefully.` });
            res.end()
        });
    }

    _sendGossip(targetNode, action, idAction) {
        let nodesToGossip = this._chooseRandomNodes(this.degreeGossip);

        for (const nodeToGossip of nodesToGossip) {

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

    moveToHandOff() {

        // This method takes all files stored in the nodes folder and moves them to their handoff folder

        const sanitizedAddress = this.address.replace(/[:/]/g, '_'); // Replace colons and slashes with underscores
        const folderPath = path.join("data", sanitizedAddress);
        if (!fs.existsSync(folderPath)) {
            return
        }
        const files = fs.readdirSync(folderPath);
        const handoffFolderPath = path.join(folderPath, "handoff");

        if (!fs.existsSync(handoffFolderPath)) {
            fs.mkdirSync(handoffFolderPath, { recursive: true }); // Use a recursive option to create parent directories if they don't exist
        }

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const handoffFilePath = path.join(handoffFolderPath, file);
            fs.renameSync(filePath, handoffFilePath);
        }


    }


    async handoff() {

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

    storeEndpoint(req, res) {
        return new Promise(async (resolve, reject) => {
            try {
                let handoff = false;
                if ("handoff" in req.body)
                    handoff = true;

                let list = await this.store(req, handoff);
                res.status(200).json({ message: `\n Posted to Server and its neighbors!`, data: list });

                // Resolve the promise with the list
                resolve(list);
            }
            catch (error) {
                reject(error)
            }
        });
    }


    store(req, handoff = false) {

        const requestBody = req.body;
        const requestId = requestBody.id;
        const crdt = requestBody.payload
        const targetNodes = this.consistentHashing.getNode(requestId).slice(0, this.neighboorhood);


        const sanitizedAddress = this.address.replace(/[:/]/g, '_'); // Replace colons and slashes with underscores
        let folderPath = path.join("data", sanitizedAddress);

        if (!targetNodes.includes(this.address) || handoff) {
            folderPath = path.join(folderPath, "handoff");
        }

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true }); // Use a recursive option to create parent directories if they don't exist
        }

        if ('handoff' in requestBody)
            delete requestBody.handoff

        const filePath = path.join(folderPath, `${requestId}.json`);

        let old_crdt = new BAWMap();
        if (fs.existsSync(filePath)) {
            old_crdt = BAWMap.fromJSON(JSON.parse(fs.readFileSync(filePath, 'utf-8')));

        }
        //console.log(typeof crdt);
        //consoVle.log(crdt);
        old_crdt.merge(BAWMap.fromJSON(crdt))
        fs.writeFileSync(filePath, JSON.stringify(old_crdt.toJSON()));
        return old_crdt.toJSON();

    }


    async postList(req, res) {

        const requestBody = req.body;
        const requestId = requestBody.id;
        const preferenceList = this.consistentHashing.getNode(requestId, this.neighboorhood);
        let lists = [];
        let list = {};

        let i = 0
        let chosenNeighboors = []


        console.log(preferenceList)

        while (i < preferenceList.length) {
            let node = preferenceList[i];
            try {
                lists.push(await axios.post(`${node}/store`, requestBody));
                chosenNeighboors.push(node);
                if (chosenNeighboors.length === this.neighboorhood) {
                    break;
                }
            }

            catch (error) {
                console.log(`Error: ${error.message}`);
            }
            finally {
                i++;
            }
        }

        if (chosenNeighboors.length < this.neighboorhood) {
            let newRequestBody = { ...requestBody }
            newRequestBody.handoff = true;

            for (const neighbor of chosenNeighboors) {

                lists.push(await axios.post(`${neighbor}/store`, newRequestBody, { params: { handoff: true } }));
            }
        }


        const responses = await Promise.all(lists);
        for (const response of responses) {
            if (response.status === 200) {
                res.status(200).json({ message: `\n Posted to Server and its neighbors!`, data: response.data });
                res.end()
                return
            }

        }

        res.status(500).json({ message: `\nWent wrong while posting to neighbors!` });
        res.end()

    }

    setNodes(req, res) {
        const nodes = req.body.nodes
        this.consistentHashing = new ConsistentHashing(nodes, 4)
    }
}

export { Node };