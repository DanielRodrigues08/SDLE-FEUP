import crypto from "crypto";

class ConsistentHashing {


    constructor(nodes = [], replicas = 3) {
        this.nodes = new Map(); // { hash: node }
        this.replicas = replicas;
        nodes.forEach(node => this.addNode(node));
    }

    addNode(node) {
        if (Array.from(this.nodes.values()).includes(node)) {
            return
        }

        for (let i = 0; i < this.replicas; i++) {
            const replicaKey = this.getReplicaKey(node, i);
            this.nodes.set(replicaKey, node);
        }
    }


    removeNode(node) {
        if (!Array.from(this.nodes.values()).includes(node)) {
            return
        }

        for (let i = 0; i < this.replicas; i++) {
            const replicaKey = this.getReplicaKey(node, i);
            this.nodes.delete(replicaKey);
        }
    }

    update(incomingNodes) {
        const existingNodes = new Set(this.nodes.values());

        const newNodes = incomingNodes.filter(node => !existingNodes.has(node));
        const removedNodes = Array.from(existingNodes).filter(node => !incomingNodes.includes(node));

        /*console.log("Removing nodes:")
        console.log(removedNodes);
        console.log("Adding nodes:")
        console.log(newNodes);*/

        newNodes.forEach(node => this.addNode(node));
        removedNodes.forEach(node => this.removeNode(node));
    }

    getNode(key) {
        if (this.nodes.size === 0) {
            return null;
        }

        const hash = this.hash(key);
        const keys = Array.from(this.nodes.keys());
        const sortedKeys = keys.sort();

        for (const nodeHash of sortedKeys) {
            if (hash <= nodeHash) {
                return this.nodes.get(nodeHash);
            }
        }

        // If the hash is greater than all nodes, return the first node
        return this.nodes.get(sortedKeys[0]);
    }

    getReplicaKey(node, replicaIndex) {
        return this.hash(`${node}-${replicaIndex}`);
    }

    hash(data) {
        return parseInt(crypto.createHash('md5').update(data).digest('hex'), 16);
    }

    getFormattedRingJSON() {
        const ringEntries = [];
        for (const [hash, node] of this.nodes) {
            ringEntries.push({hash, node});
        }
        ringEntries.sort((a, b) => a.hash - b.hash);
        return ringEntries.map(entry => ({hash: entry.hash, node: entry.node}));
    }

    getNodes() {
        return this.nodes.values()
    }
}

export {ConsistentHashing};