import { writable } from "svelte/store";

function createdListsStore() {
    const { subscribe, set, update } = writable({
        lists: {
            one: {
                id: "one",
                name: "Example"
            }
        },
        order: ["one"],
    });
    function addList(list) {
        return update(l => {
            const newLists = { ...l.lists };
            newLists[list.id] = list;
            const newOrder = [...l.order, list.id];
            return { order: newOrder, lists: newLists };
        })
    }
    function removeList(id) { }
    function updateList(list) { }
    return {
        subscribe,
        add: addList,
        remove: removeList,
        update: updateList,
    }
}
export const openedLists = createdListsStore();
export const openedListsOrder = writable(["one"]);

