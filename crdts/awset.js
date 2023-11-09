import { CausalContext } from "./causalcontext.js";

class AWSet {
    constructor(tag) {
        this.tag = tag;
        // A map From Element to a set of tag-context
        this.items = new Map();
        this.seen = new CausalContext();
        // Uma ideia que tive é tentar verificar se no context em vez de conter a tag ter uma tag
        // maior ou igual ou seja será eliminado ???
    }
    add(element) {
        const contextItem = this.seen.next(this.tag);
        if (!this.items.has(element)) {
            this.items.set(element, new Set());
        }
        this.items.get(element).add(contextItem);
    }
    remove(element) {
        if (!this.items.has(element)) {
            return;
        }
        this.items.delete(element);
    }
    elements() {
        return this.items.keys();
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
        for (const key of this.items.keys()) { allKeys.add(key) };
        for (const key of other.set.keys()) { allKeys.add(key) };

        for (const key of allKeys) {

            const thisItems = safeGet(this.items, key, new Set());
            const otherItems = safeGet(this.items, key, new Set());

            const inCommon = setIntesection(thisItems, otherItems);
            const inThis = setDifference(thisItems, otherItems);
            const inOther = setDifference(otherItems, thisItems);

            const result = new Set();
            for (const item of inCommon) {
                result.add(item);
            }
            // f filtering function
            for (const item of inThis) {
                // usar o seen.max(tag) ???
                if (!other.seen.has(item)) {
                    result.add(item);
                }
            }
            // f filtering function
            for (const item of inOther) {
                // usar o seen.max(tag)??
                if (!this.seen.has(item)) {
                    result.add(item);
                }
            }
            this.items.set(key, result);
        }
    }

}

export { AWSet };