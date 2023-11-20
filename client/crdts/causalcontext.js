class CausalContext {
    constructor() {
        this.items = new Map();
    }
    max(tag) {
        let max = 0;
        if (this.items.has(tag)) {
            max = this.items.get(tag);
        }
        return max;
    }
    next(tag) {
        let next = this.max(tag) + 1;
        this.items.set(tag, next);
        return next;
    }
    merge(other) {
        for (const [tag, counter] of other.items.entries()) {
            if (this.items.has(tag)) {
                const updated = Math.max(this.items.get(tag), counter);
                this.items.set(tag, updated);
            }
            else {
                this.items.set(tag, counter);
            }
        }
    }
}

export { CausalContext };