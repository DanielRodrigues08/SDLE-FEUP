import { BAWMap, PNCounter } from "crdts";
class ShoppingList {
    constructor(name) {
        this.name = name;
        // Shoppping List UUID\
        this.id = crypto.randomUUID();
        // This Replica's UUID
        this.replicaID = crypto.randomUUID();
        this.items = new BAWMap(this.replicaID);
    }
    addItem(name) {
        const item = new BAWMap(this.replicaID);
        item.set("desired", new PNCounter(this.replicaID));
        item.set("purchased", new PNCounter(this.replicaID));
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
            replicaID: this.replicaID,
            name: this.name,
            items: this.items.toJSON(),
        };
        return res;
    }
    static fromJSON(json) {
        const res = new ShoppingList();
        res.id = json.id;
        res.replicaID = json.replicaID;
        res.name = json.name;
        res.items = BAWMap.fromJSON(json.items);
        return res;
    }
}

export { ShoppingList };