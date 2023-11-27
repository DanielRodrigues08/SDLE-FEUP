// Grow Only Set
class GSet {
    constructor() {
        this.set = new Set();
    }
    add(element) {
        this.set.add(element);
    }
    contains(element) {
        return this.set.has(element);
    }
    elements() {
        return this.set.keys();
    }
    merge(other) {
        for (const key of other.elements()) {
            this.set.add(key);
        }
    }
    toJSON() {
        const res = {};
        for (const key of this.set.keys()) {
            res[key] = true;
        }
        return res;
    }
    static fromJSON(json) {
        const res = new GSet();
        for (const key of Object.keys(json)) {
            res.set.add(key);
        }
    }
}
export { GSet };