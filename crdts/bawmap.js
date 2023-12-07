import { AWSet } from "./awset.js";

class BAWMap {
    constructor(tag) {
        // Set of keys
        this.ks = new AWSet(tag);
        // Map from key to value
        this.kvs = new Map();
    }
    values() {
        return Array.from(this.kvs.values());
    }
    keys() {
        return Array.from(this.kvs.keys());
    }
    entries() {
        return Array.from(this.kvs.entries());
    }

    get(key, ifNotThere) {
        if (this.kvs.has(key)) {
            return this.kvs.get(key);
        }
        return ifNotThere;
    }
    set(key, value) {
        this.remove(key);
        this.ks.add(key);
        this.kvs.set(key, value);
    }
    remove(key) {
        if (!this.kvs.has(key)) {
            return;
        }
        this.ks.remove(key);
        this.kvs.delete(key);
    }
    contains(key) {
        return this.kvs.has(key);
    }

    merge(other) {
        this.ks.merge(other.ks);
        const map = new Map();
        for (const key of this.ks.elements()) {
            const inThis = this.kvs.get(key);
            const inOther = other.get(key)
            // They must be crdts and of the same type
            if (inThis && inOther) {
                inThis.merge(inOther);
                map.set(key, inThis);
            }
            else if (inThis) {
                map.set(key, inThis);
            }
            else {
                map.set(key, inOther);
            }
        }
        this.kvs = map;
    }

}
export { BAWMap };