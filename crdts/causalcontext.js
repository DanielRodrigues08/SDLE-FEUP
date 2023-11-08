class CausalContext {
    constructor() {
        this.items = new Map();
    }
    next(tag) {
        let current = 0;
        if (this.items.has(tag)) {
            current = this.items.get(tag);
        }
        let next = current + 1;
        this.items.set(tag, next);
        return current;
    }
}

export { CausalContext };