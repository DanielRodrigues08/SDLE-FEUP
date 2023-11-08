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
        for (const element of other.elements()) {
            this.set.add(element);
        }
    }
}
export { GSet };