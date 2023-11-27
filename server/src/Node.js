const ConsistentHashing = require("./ConsistentHashing");

class Node {
    constructor(host, port, nodes, numInstances) {
        this.host = host
        this.port = port
        this.consistentHashing = new ConsistentHashing(nodes, numInstances)

    }

}