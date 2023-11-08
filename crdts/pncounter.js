import { PCounter } from "./pcounter.js";

class PNCounter {
    constructor(tag) {
        this.tag = tag;
        this.positive = new PCounter(tag);
        this.negative = new PCounter(tag);

    }
    increment(amount = 1) {
        // TODO add safety mechanism?
        this.positive.increment(amount);

    }
    decrement(amount = 1) {
        // TODO add safety mechanism?
        this.negative.increment(amount);
    }
    merge(other) {
        this.positive.merge(other.positive);
        this.negative.merge(other.negative);
    }
    value() {
        const toAdd = this.positive.value();
        const toSub = this.negative.value();
        return toAdd - toSub;

    }
}
export {PNCounter};