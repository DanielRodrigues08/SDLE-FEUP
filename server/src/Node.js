const ConsistentHashing = require("./ConsistentHashing");
const express = require('express')
const axios = require('axios')

class Node {
    constructor(host, port, nodes, numInstances, gossipPeriod = 10000) {
        this.host = host
        this.port = port
        this.nodes = nodes
        this.consistentHashing = new ConsistentHashing(nodes, numInstances)
        this.server = express()
        this.server.use(express.json())
        this.gossipPeriod = gossipPeriod
    }

    run() {
        this.server.post('/processRequest', this.processRequest)
        this.server.put('/gossip', this.handleGossip)

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
        console.log("Received a gossip! My ip is: " + this.host + ":" + this.port)
        res.status(200).json({message: 'Merged!'})
    }

    processRequest(req, res) {
        console.log("Not implemented!")
    }

    async startGossip() {
        const randomIndex = Math.floor(Math.random() * this.nodes.length);
        try {
            const resp = await axios.put(`${this.nodes[randomIndex]}/gossip`)
            console.log("Gossip to " + this.nodes[randomIndex] + " from " + this.host + ":" + this.port + " successful!")
        } catch (error) {
            console.log("Gossip Failed!")
        }
    }
}

module.exports = Node;