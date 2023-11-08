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
        return this.set.elements().filter(x => !this.toombstone.contains(x));
    }
    contains(element) {
        return this.set.contains(element) && !this.toombstone.contains(element);
    }
    merge(other) {
        this.set.merge(other.set);
        this.toombstone.merge(other.toombstone);
    }
}