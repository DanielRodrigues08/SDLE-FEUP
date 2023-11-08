// Basic Add Wins Set
import { GSet } from "./gset.js";

function randomUUID() {
    if (window && window.crypto && window.crypto) {
        return window.crypto.randomUUID();
    }
    const range = 1e10;
    return Date.now().toString() + toString(Math.random() * range);
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
            if (el == element && !this.removed.has(tag)) {
                return true;
            }
        }
        return false;
    }
    elements() {
        const result = [];
        for (const [element, tag] of this.set.elements()) {
            if (!this.removed.has(tag)) {
                result.push(element);
            }
        }
        return result;

    }
    merge(other) {
        this.set.merge(other.set);
        this.removed.merge(other.removed);
    }
}