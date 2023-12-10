import { writable } from "svelte/store";
import { ShoppingList } from "./ShoppingList";

function createdListsStore() {
    const exemplo = new ShoppingList("Exemplo");
    exemplo.id = "one";
    const { subscribe, set, update } = writable({
        lists: {

        },
        order: [

        ],
        current: null,
    });
    function addList(list) {
        return update(l => {
            const newLists = { ...l.lists };
            newLists[list.id] = list;
            const newOrder = [list.id, ...l.order];
            return { order: newOrder, lists: newLists };
        })
    }
    function closeList(id) {
        return update(l => {
            const lists = {};
            const order = [];
            for (const [key, value] of Object.entries(l.lists)) {
                if (key !== id) {
                    lists[key] = value;
                }
            }
            for (const key of l.order) {
                if (key != id) {
                    order.push(key);
                }
            }
            const current = l.current === id ? null : l.current;
            return { lists: lists, order: order, current: current };
        })
    }
    function updateList(list) { }
    return {
        subscribe,
        add: addList,
        update: updateList,
        close: closeList,
        setCurrent: id => update(l => { return { ...l, current: id } }),
    }
}
export const openedLists = createdListsStore();

export const storageSettings = writable({
    fs: {
        access: false,
        dir: null,
    },
    localStorage: false,
});