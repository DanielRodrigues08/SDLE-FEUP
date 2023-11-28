import {AWSet} from "crdts";
import {ConsistentHashing} from "./ConsistentHashing.js";
import express from "express";
import axios from "axios";

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
        this.server.post('/gossip', this.handleGossip.bind(this))
        this.server.get('/nodes', this.getNodes.bind(this))
        this.server.post('/shutdown', this.shutdown.bind(this))
        this.server.get('/ring', this.getRing.bind(this))

        this.server.listen(this.port, () => {
            setInterval(this.startGossip.bind(this), this.gossipPeriod)
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
    }

    getRing(req, res) {
        res.status(200).json(this.consistentHashing.getFormattedRingJSON())
    }

    handleGossip(req, res) {
        this.nodes.merge(AWSet.fromJSON(req.body.nodes))
        console.log(`Received gossip from ${req.body.from}!\n`)
        res.status(200).json({nodes: this.nodes.toJSON()});
        this.consistentHashing.update(this.nodes.elements())
    }

    processRequest(req, res) {
        console.log("Not implemented!")
    }

    getNodes(req, res) {
        res.json({nodes: JSON.stringify(this.nodes.elements())})
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