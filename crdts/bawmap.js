import { AWSet } from "./awset.js";
import { BAWSet } from "./bawset.js";
import { GSet } from "./gset.js";
import { PCounter } from "./pcounter.js";
import { PNCounter } from "./pncounter.js";
import { ROSet } from "./roset.js";

class BAWMap {
    constructor(tag) {
        // Set of keys
        this.tag = tag;
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
    toJSON() {
        const res = {};
        res.tag = this.tag;
        res.__type = this.constructor.name;
        res.ks = this.ks.toJSON();
        res.kvs = {};
        for (const [key, value] of this.kvs.entries()) {
            const valueJSON = value.toJSON();
            valueJSON["__type"] = value.constructor ? value.constructor.name : typeof value;
            res.kvs[key] = valueJSON;
        }
        return res;

    }
    static fromJSON(json) {
        const res = new BAWMap();
        res.tag = json.tag;
        res.ks = AWSet.fromJSON(json.ks);
        res.kvs = new Map()
        // Serialization of CRDTS should be delagated to its own class so that theese dependencies
        // are broken
        const possibleClasses = [BAWMap, PNCounter, AWSet, BAWSet, ROSet, PCounter, GSet];
        const classMapping = {};
        for (const c of possibleClasses) {
            const key = c.name;
            classMapping[key] = c;
        }
        for (const key in json.kvs) {
            const jsonItem = json.kvs[key];
            const itemClass = classMapping[jsonItem.__type];
            const item = itemClass.fromJSON(jsonItem);
            res.kvs.set(key, item);
        }
        return res;
    }

}
export { BAWMap };