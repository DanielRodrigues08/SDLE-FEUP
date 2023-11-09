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
        return this.set.entries();
    }
    merge(other) {
        for (const [key, _] of other.elements()) {
            this.set.add(key);
        }
    }
}
export { GSet };