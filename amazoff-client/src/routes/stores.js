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
    function removeList(id) { }
    function updateList(list) { }
    function closeCurrentList() {
        return update(l => {
            const newLists = [];
            for (let i = 0; i < l.lists.length; i++) {
                if (l.lists[i] !== l.current) {
                    newLists.push(l.lists[i]);
                }
            }
            const newOrder = l.order.splice(0, 1);
            return { lists: newLists, order: newOrder, current: null };
        });
    }
    return {
        subscribe,
        add: addList,
        remove: removeList,
        update: updateList,
        setCurrent: id => update(l => { return { ...l, current: id } }),
        closeCurrent: closeCurrentList,
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