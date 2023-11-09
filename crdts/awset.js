import { CausalContext } from "./causalcontext";

class AWSet {
    constructor(tag) {
        this.tag = tag;
        this.set = new Map();
        this.seen = new CausalContext();
    }
    add(element) {
        const contextItem = this.seen.next(this.tag);
        if (!this.set.has(element)) {
            this.set.set(element, new Set());
        }
        this.set.get(element).add(contextItem);
    }
    remove(element) {
        if (!this.set.has(element)) {
            return;
        }
        this.set.delete(element);
    }
    elements() {
        return this.set.keys();
    }
    merge(other) {
        function setIntesection(a, b) {
            let res = new Set();
            for (const el of a.elements()) {
                if (b.has(el)) {
                    res.add(el);
                }
            }
            return res;
        }
        function setDifference(a, b) {
            let intersection = setIntesection(a, b);
            let res = new Set();
            for (const el of a.element()) {
                if (!intersection.has(el)) {
                    res.push(el);
                }
            }
        }
        function safeGet(set, key, val) {
            if (!set.has(key)) {
                set.set(key, val);
            }
            return set.get(key);

        }
        const allKeys = new Set();
        for (const key of this.set.keys()) { allKeys.add(key) };
        for (const key of other.set.keys()) { allKeys.add(key) };

        for (const key of allKeys) {

            const thisItems = safeGet(this.set, key, new Set());
            const otherItems = safeGet(this.set, key, new Set());

            const inCommon = setIntesection(thisItems, otherItems);
            const inThis = setDifference(thisItems, otherItems);
            const inOther = setDifference(otherItems, thisItems);

            const result = new Set();
            for (const item of inCommon) {
                result.add(item);
            }
            // f filtering function
            for (const item of inThis) {
                if (!other.seen.has(item)) {
                    result.add(item);
                }
            }
            // f filtering function
            for (const item of inOther) {
                if (!this.seen.has(item)) {
                    result.add(item);
                }
            }
            this.set.set(key, result);
        }
    }

}

export { AWSet };