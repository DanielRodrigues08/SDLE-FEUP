import {AWSet} from "crdts";
import {ConsistentHashing} from "./ConsistentHashing.js";
import express from "express";
import axios from "axios";

import fs from "fs";
import path from "path";

class Node {
    constructor(hostname, port, allNodes, numInstances, gossipPeriod = 5000, protocol = "http") {
        this.host              = hostname
        this.port              = port
        this.neighboorhood     = 3
        this.address           = `${protocol}://${hostname}:${port}`
        this.consistentHashing = new ConsistentHashing(allNodes, numInstances)

        this.nodes = new AWSet(this.address)

        for (const node of allNodes) {
            this.nodes.add(node)
        }
        this.server = express()
        this.server.use(express.json())
        this.gossipPeriod = gossipPeriod
    }

    run() {

        this.server.post('/postList', this.postList.bind(this))
        this.server.post('/gossip', this.handleGossip.bind(this))
        this.server.get('/nodes', this.getNodes.bind(this))
        this.server.post('/store', this.store.bind(this))
        this.server.post('/shutdown', this.shutdown.bind(this))
        this.server.post('/addNode', this.addNode.bind(this))
        this.server.post('/removeNode', this.removeNode.bind(this))
        this.server.get('/ring', this.getRing.bind(this))

        this.server.listen(this.port, () => {
            setInterval(this.startGossip.bind(this), this.gossipPeriod)
            setInterval(this.handoff.bind(this), 10000)
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

    getRing(req, res) {
        res.status(200).json(this.consistentHashing.getFormattedRingJSON())
        res.end()
    }

    addNode(req, res) {
        const requestBody = req.body;
        const node = requestBody.address;
        this.nodes.add(node);
        this.consistentHashing.update(this.nodes.elements())
        res.status(200).json({message: `Node ${node} added to ring`});
        res.end()
    }

    removeNode(req, res) {
        const requestBody = req.body;
        const node = requestBody.address;
        this.nodes.remove(node);
        this.consistentHashing.update(this.nodes.elements())
        res.status(200).json({message: `Node ${node} removed from ring`});
        res.end()
    }

    handleGossip(req, res) {
        this.nodes.merge(AWSet.fromJSON(req.body.nodes))
        console.log(`Received gossip from ${req.body.from}!\n`)
        res.status(200).json({nodes: this.nodes.toJSON()});
        this.consistentHashing.update(this.nodes.elements())
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
            const targetNodes = this.consistentHashing.getNode(requestId).splice(this.neighboorhood);

            for (const node of targetNodes) {

                if (node == this.address) {
                    continue;
                }

                console.log(`Forwarding request to ${node}`);
                const response = await axios.post(`${node}/store`, fileData)
                if (response.status != 200) {
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
        const targetNodes = this.consistentHashing.getNode(requestId).splice(this.neighboorhood);


        const sanitizedAddress = this.address.replace(/[:/]/g, '_'); // Replace colons and slashes with underscores
        let folderPath       = path.join("data", sanitizedAddress);

        if (!targetNodes.includes(this.address)) {
            folderPath = path.join(folderPath, "handoff");            
        }
        
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true }); // Use recursive option to create parent directories if they don't exist
        }

        
            //if (fs.existsSync(filePath)) {
                //existingList = JSON.parse(fs.readFileSync(filePath).toString());
            //}

            // let listCRDT = AWSet.fromJSON(existingList);
            // let postCRDT = AWSet.fromJSON(requestBody);
            // listCRDT.merge(postCRDT);

        const filePath         = path.join(folderPath, `${requestId}.json`);
        fs.writeFileSync(filePath, JSON.stringify(requestBody));
        return requestBody;

    }


    postList(req, res) {

        const requestBody    = req.body;
        const requestId      = requestBody.id;
        const preferenceList = this.consistentHashing.getNode(requestId, this.neighboorhood);
        let list = {};
    
        let i = 0
        while(i < this.neighboorhood && i < preferenceList.length) {
            let node = preferenceList[i];
            try {
                if (node == this.address) {
                        list = this.store(req);

                } else {
                    console.log(`Forwarding request to ${node}`);
                    list = axios.post(`${node}/store`, requestBody);
                }
                if (list != null)
                    lists.push(list);     
                i += 1;
                }                    
            catch (error) {
                    i += 1
                }       
        }

        res.status(200).json({ message: `\n Posted to Server and its neighbors!`, data: JSON.stringify(list[0])});
        res.end()

    }

    getNodes(req, res) {
        res.json({nodes: JSON.stringify(this.nodes.elements())})
        res.end()
    }

    async startGossip() {
        if (this.nodes.elements().length < 2) {
            return
        }

        let randomNode;
        do {
            randomNode = this.nodes.elements()[Math.floor(Math.random() * this.nodes.elements().length)];
        } while (randomNode === this.address)

        try {
            console.log(`Gossiping with ${randomNode}!`)
            const response = await axios.post(`${randomNode}/gossip`, {
                nodes: this.nodes.toJSON(),
                from: this.address
            })
            this.nodes.merge(AWSet.fromJSON(response.data.nodes))
            console.log(`Gossip with ${randomNode} successful!\n`)
        } catch (e) {
            console.log(`Failed to gossip with ${randomNode}!`)
            console.log(e + "\n")
            this.nodes.remove(randomNode)
        }

        this.consistentHashing.update(this.nodes.elements())
    }
}

export {Node};