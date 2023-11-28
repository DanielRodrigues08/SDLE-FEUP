import * as crypto from "crypto";

class ConsistentHashing {


    constructor(nodes = [], replicas = 3) {
        this.nodes = new Map(); // { hash: node }
        this.replicas = replicas;
        nodes.forEach(node => this.addNode(node));
    }

    addNode(node) {
        if (this.nodes.values.hasOwnProperty(node))
            return

        for (let i = 0; i < this.replicas; i++) {
            const replicaKey = this.getReplicaKey(node, i);
            this.nodes.set(replicaKey, node);
        }
    }

    removeNode(node) {
        if (!this.nodes.values.hasOwnProperty(node))
            return

        for (let i = 0; i < this.replicas; i++) {
            const replicaKey = this.getReplicaKey(node, i);
            this.nodes.delete(replicaKey);
        }
    }

    getNode(key, count = 3) {
        if (this.nodes.size === 0) {
            return null;
        }

        const hash = this.hash(key);
        const keys = Array.from(this.nodes.keys());
        const sortedKeys = keys.sort();

        const uniqueNodesSet = new Set();
        const nodeArray = [];
        
        for (const nodeHash of sortedKeys) {
            if (hash <= nodeHash)  {

                const node = this.nodes.get(nodeHash);
                if (!uniqueNodesSet.has(node)) {
                    uniqueNodesSet.add(node);
                    nodeArray.push(node);

                    if (uniqueNodesSet.size >= count)
                        break;
                }

            }
        }

        while (uniqueNodesSet.size < count) {
            for (let i = 0; i < sortedKeys.length; i++) {
                const node = this.nodes.get(sortedKeys[i]);
                if (!uniqueNodesSet.has(node)) {
                    uniqueNodesSet.add(node);
                    nodeArray.push(node);

                    if (uniqueNodesSet.size >= count)
                        return nodeArray;
                }
            }
        }

        return nodeArray;
    }

    getReplicaKey(node, replicaIndex) {
        return this.hash(`${node}-${replicaIndex}`);
    }

    hash(data) {
        return parseInt(crypto.createHash('md5').update(data).digest('hex'), 16);
    }

    visualizeRing() {
        const ring = [];
        for (const [hash, node] of this.nodes) {
            ring.push({ hash, node });
        }
        ring.sort((a, b) => a.hash - b.hash);
        console.log('Consistent Hashing Ring:');
        ring.forEach(entry => console.log(`Hash: ${entry.hash}, Node: ${entry.node}`));
    }

    getNodes() {
        return this.nodes.values()
    }
}

export { ConsistentHashing };