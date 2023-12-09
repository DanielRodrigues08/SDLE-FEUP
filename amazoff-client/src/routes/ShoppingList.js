import { BAWMap, PNCounter } from "crdts";
class ShoppingList {
    constructor(name) {
        this.name = name;
        this.id = crypto.randomUUID();
        this.items = new BAWMap();
    }
    addItem(name) {
        const item = new BAWMap(this.id);
        item.set("desired", new PNCounter(this.id));
        item.set("purchased", new PNCounter(this.id));
        this.items.set(name, item);
    }
    removeItem(name) {
        this.items.remove(name);
    }
    changeQuantity(item, type, increment) {
        const counter = this.items.get(item).get(type);
        if (increment == "increment") {
            counter.increment();
        } else if (counter.value() > 0) {
            counter.decrement();
        }
    }
    toJSON() {
        const res = {
            id: this.id,
            name: this.name,
            items: this.items.toJSON(),
        };
        return res;
    }
    static fromJSON(json) {
        const res = new ShoppingList();
        res.id = json.id;
        res.name = json.name;
        res.items = BAWMap.fromJSON(json.items);
        return res;
    }
}

export { ShoppingList };