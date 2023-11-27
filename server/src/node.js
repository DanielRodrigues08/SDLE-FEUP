import { AWSet } from "crdts";
const ConsistentHashing = require("./ConsistentHashing");
const express = require('express')
const axios = require('axios')

class Node {
    constructor(hostname, port, allNodes, numInstances, gossipPeriod = 5000, protocol = "http") {
        this.host = hostname
        this.port = port
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

        this.server.post('/processRequest', this.processRequest.bind(this))
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

    processRequest(req, res) {
        console.log("Not implemented!")
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

module.exports = Node;