// Remove Once Set
import { GSet } from "./gset.js"
class ROSet {
    constructor() {
        this.set = new GSet();
        this.toombstone = new GSet();
    }
    add(element) {
        this.set.add(element);
    }
    remove(element) {
        this.toombstone.add(element);
    }
    elements() {
        const res = [];
        for (const [key, _] of this.set.elements()) {
            if (!this.toombstone.contains(key)) {
                res.push(key);
            }
        }
        return res;
    }
    contains(element) {
        return this.set.contains(element) && !this.toombstone.contains(element);
    }
    merge(other) {
        this.set.merge(other.set);
        this.toombstone.merge(other.toombstone);
    }
}
export { ROSet };