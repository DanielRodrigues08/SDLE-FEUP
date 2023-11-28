import { AWSet } from "crdts";
import { ConsistentHashing } from "./ConsistentHashing";
import * as express from "express";
import * as axios from "axios";

import fs from "fs";
import path from "path";

class Node {
    constructor(hostname, port, allNodes, numInstances, gossipPeriod = 5000, protocol = "http") {
        this.host = hostname
        this.port = port
        this.neighboorhood = 3
        this.address = `${protocol}://${hostname}:${port}`
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
        this.server.put('/gossip', this.handleGossip.bind(this))
        this.server.get('/nodeList', this.getNodeList.bind(this))

        this.server.listen(this.port, () => {
            setInterval(() => this.startGossip(), this.gossipPeriod) // Arrow function preserves 'this'
            console.log(`Node listening on port ${this.port}!`)
        })
    }

    close() {
        if (this.server) {
            this.server.close(() => console.log(`Server ${this.host + this.port} closed! `))
        }
    }

    handleGossip(req, res) {
        this.nodes.merge(AWSet.fromJSON(req.body.nodes))
        console.log(`Received gossip from ${req.body.from}!\n`)
        res.status(200).json({ nodes: this.nodes.toJSON() });
    }

    store(req, res) {

        const requestBody = req.body;
        const requestId   = requestBody.id;
        const targetNodes = this.consistentHashing.getNode(requestId, this.neighboorhood);

        if (!targetNodes.includes(this.address)) {
            res.status(400).json({ error: `Request ID ${requestId} does not belong to this node.` });
            return;
        }

        try {

          const folderPath  = path.join(__dirname, this.address);
          const filePath    = path.join(folderPath, `${requestId}.json`);
          const requestId   = req.body.id;
          const requestBody = req.body;
          let existingList  =  {};
    
          if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
          }
          if (fs.existsSync(filePath)) {
            existingList = JSON.parse(fs.readFileSync(filePath).toString());
          }

          let listCRDT = AWSet.fromJSON(existingList);
          let postCRDT = AWSet.fromJSON(requestBody);
          listCRDT.merge(postCRDT);
    
          fs.writeFileSync(filePath, listCRDT.toJSON());
          res.status(200).json({ message: `Data stored in ${filePath}` });

        } catch (error) {
          console.error("Error storing data:", error.message);
          res.status(500).json({ error: "Internal Server Error" });
        }

    }

    getList(requestBody) {
        
        const requestId   = requestBody.id;

        const folderPath  = path.join(__dirname, this.address);
        const filePath    = path.join(folderPath, `${requestId}.json`);
        const existingList  =  {};

        try {
            if (fs.existsSync(filePath)) {
                existingList = JSON.parse(fs.readFileSync(filePath).toString());
            }
            return existingList;
        } catch (error) {
            
            return null;
        }
        

    }

    postList(req, res){

        const requestBody = req.body;
        const requestId   = requestBody.id;
        const targetNodes = this.consistentHashing.getNode(requestId, this.neighboorhood);
        let list          = {};

        try {

            const lists = [];

            for (let i = 1; i < targetNodes.size(); i++) {

                if (node == this.address) {
                    this.store(req, res);
                    list = this.getList(requestBody)

                } else {
                    console.log(`Forwarding request to ${node}`);
                    axios.post(`${node}/store`, requestBody);
                    const response  = axios.post(`${targetNode}/store`, requestBody);
                    list = response.data
                }
                if (list != null)
                    lists.push(list);
                
            }
            


            res.status(200).json({ message: `\n Posted to Server ${targetNode} and its neighbors!`, data: lists[0]});
        }
        catch (error) {
            console.error("Error posting data:", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    getNodeList(req, res) {
        res.json({ nodes: JSON.stringify(this.nodes.elements()) })
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
            const response = await axios.put(`${randomNode}/gossip`, {
                nodes: this.nodes.toJSON(),
                from: this.address
            })
            this.nodes.merge(AWSet.fromJSON(response.data.nodes))
            console.log(`Gossip with ${randomNode} successful!\n`)
        } catch (e) {
            console.log(`Failed to gossip with ${randomNode}!\n`)
            this.nodes.remove(randomNode)
        }
    }
}

export { Node };