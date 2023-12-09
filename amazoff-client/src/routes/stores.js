import { writable } from "svelte/store";
export const ssr = false;
function createdListsStore() {
    const { subscribe, set, update } = writable({
        lists: {
            one: {
                id: "one",
                name: "Example"
            }
        },
        order: ["one"],
        current: null,
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
        setCurrent: id => update(l => { return { ...l, current: id } })
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