// Basic Add Wins Set
import { GSet } from "./gset.js";

function randomUUID() {
    if (window && window.crypto && window.crypto.randomUUID) {
        return window.crypto.randomUUID();
    }
    const range = 1e10;
    return Date.now().toString() + Math.random() * range;
}
// Understand why the removed elements must be kept in the set
class BAWSet {
    constructor() {
        this.set = new GSet();
        this.removed = new GSet();
    }
    add(element) {
        const tag = randomUUID();
        this.set.add([element, tag]);
    }
    remove(toRemove) {
        for (const [element, tag] of this.set.elements()) {
            if (element == toRemove) {
                this.removed.add(tag);
            }
        }
    }
    contains(element) {
        for (const [el, tag] of this.set.elements()) {
            if (el == element && !this.removed.contains(tag)) {
                return true;
            }
        }
        return false;
    }
    elements() {
        const result = new Set();
        for (const [element, tag] of this.set.elements()) {
            if (!this.removed.contains(tag)) {
                result.add(element);
            }
        }
        return result;

    }
    merge(other) {
        this.set.merge(other.set);
        this.removed.merge(other.removed);
    }
    toJSON() {
        const res = {};
        for (const key in this) {
            res[key] = JSON.stringify(this[key]);
        }
        return res;
    }
    static fromJSON(json) {
        const res = new BAWSet();
        for (const key in json) {
            res[key] = GSet.fromJSON(json[key]);
        }
        return res;
    }
}

export { BAWSet };