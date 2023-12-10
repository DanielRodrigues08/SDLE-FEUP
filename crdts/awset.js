import { CausalContext } from "./causalcontext.js";
function mapIntesection(a, b) {
    let res = new Map();
    for (const el of a.keys()) {
        if (b.has(el) && b.get(el) == a.get(el)) {
            res.set(el, a.get(el));
        }
    }
    return res;
}
function mapDifference(a, b) {
    let intersection = mapIntesection(a, b);
    let res = new Map();
    for (const el of a.keys()) {
        if (!intersection.has(el)) {
            res.set(el, a.get(el));
        }
    }
    return res;
}
function safeGet(set, key, val) {
    if (!set.has(key)) {
        return val;
    }
    return set.get(key);

}

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
            this.items.set(element, new Map());
        }
        this.items.get(element).set(this.tag, contextItem);
    }
    remove(element) {

        if (!this.items.has(element)) {
            return;
        }
        this.items.delete(element);
    }
    elements() {
        return Array.from(this.items.keys());
    }
    contains(element) {
        return this.items.has(element);
    }

    merge(other) {


        const allItems = new Set();
        for (const item of this.items.keys()) { allItems.add(item) };
        for (const item of other.items.keys()) { allItems.add(item) };

        for (const item of allItems) {
            const thisTags = safeGet(this.items, item, new Map());
            const otherTags = safeGet(other.items, item, new Map());

            const inCommon = mapIntesection(thisTags, otherTags);
            const inThis = mapDifference(thisTags, otherTags);
            const inOther = mapDifference(otherTags, thisTags);

            const mergedTags = new Map();
            for (const [tag, counter] of inCommon) {
                mergedTags.set(tag, counter);
            }


            const inThisNotSeenInOther = this._filter(inThis, other.seen);

            const inOtherNotSeenInThis = this._filter(inOther, this.seen);

            for (const [tag, counter] of inThisNotSeenInOther) {
                mergedTags.set(tag, counter);
            }

            for (const [tag, counter] of inOtherNotSeenInThis) {
                mergedTags.set(tag, counter);
            }
            if (mergedTags.size > 0) {
                this.items.set(item, mergedTags);
            }
            else if (this.items.has(item)) {
                this.items.delete(item);
            }
        }
        this.seen.merge(other.seen);
    }
    _filter(tags, causalcontext) {
        let results = [];
        for (const [tag, counter] of tags) {
            if (causalcontext.max(tag) < counter) {
                results.push([tag, counter]);
            }
        }
        return results;
    }
    toJSON() {
        const res = {};
        res.tag = this.tag;
        res.seen = this.seen.toJSON();
        res.items = {};
        for (const key of this.items.keys()) {
            res.items[key] = Object.fromEntries(this.items.get(key));
        }
        return res;
    }
    static fromJSON(json) {
        const res = new AWSet(json.tag);
        res.seen = CausalContext.fromJSON(json.seen);
        res.items = new Map();

        for (const key in json.items) {
            const map = new Map();
            for (const deepKey in json.items[key]) {
                map.set(deepKey, json.items[key][deepKey]);
            }
            res.items.set(key, map);
        }
        return res;
    }

}

export { AWSet };