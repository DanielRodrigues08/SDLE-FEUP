class PCounter {
    constructor(tag) {
        this.tag = tag;
        this.map = new Map();
        this.map.set(this.tag, 0);
    }
    value() {
        let counter = 0;
        for (const [_, value] of this.map.entries()) {
            counter += value;
        }
        return counter;
    }
    merge(pcounter) {
        for (const [key, value] of pcounter.map.entries()) {
            if (this.map.has(key)) {
                let currentValue = this.map.get(key);
                this.map.set(key, Math.max(currentValue, value));
            }
            else {
                this.map.set(key, value);
            }
        }
    }

    increment(amount=1) {
        if (amount < 0) {
            throw new Error("Trying to increment PCounter with a negative value!");
        }
        const current = this.map.get(this.tag);
        this.map.set(this.tag, current + amount);
    }


}

//export { PCounter };