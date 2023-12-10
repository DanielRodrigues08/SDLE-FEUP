import { get } from "svelte/store";
import { openedLists, storageSettings, userLists } from "./stores";
import { ShoppingList } from "./ShoppingList";

const LOCAL_STORAGE_NAME = "shoppingLists";

async function fsGetEntry(id) {
    const fs = get(storageSettings).fs;
    if (fs.dir == null || !fs.access) {
        return null;
    }
    for await (const entry of fs.dir.values()) {
        if (entry.name === id) {
            return entry;
        }
    }
    return null;
}
export async function getList(id) {
    const res = get(openedLists).lists[id];
    // L\ist already loaded
    if (res) {
        return res;
    }

    let shoppingList;
    const fs = get(storageSettings).fs;
    if (fs.access && fs.dir) {
        const entry = await fsGetEntry(id);
        if (entry) {
            shoppingList = await loadListFromFile(entry);
        }
    }
    else if (window.localStorage) {
        const allLists = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_NAME));
        if (!(allLists == null || allLists == "null")) {
            const list = allLists[id];
            if (list) {
                shoppingList = ShoppingList.fromJSON(list);
            }
        }


    }

    if (shoppingList == null) {
        shoppingList = new ShoppingList("New Shopping List");
        shoppingList.id = id;
        saveList(shoppingList);
    }
    openedLists.add(shoppingList);
    openedLists.setCurrent(shoppingList.id);
    return shoppingList;
}

async function loadListFromFile(fileEntry) {
    const file = await fileEntry.getFile();
    const json = JSON.parse(await file.text());
    return ShoppingList.fromJSON(json);
}

export async function createNewList(name, listId = null) {

    const list = new ShoppingList(name);
    if (listId !== null && listId !== "") {
        list.id = listId;
    }

    await saveList(list);
    return list;
}

export async function pollForNewLists() {
    const fs = get(storageSettings).fs;
    const all = get(userLists);
    if ((fs.dir == null || !fs.access) && window.localStorage) {
        const shoppingLists = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_NAME));
        for (const id in shoppingLists) {
            userLists.update((l) => {
                const newL = { ...l };
                newL[id] = shoppingLists[id].name;
                return newL;
            });
        }
    }
    else {
        for await (const entry of fs.dir.values()) {
            const id = all[entry.name];
            if (!id) {
                const list = await loadListFromFile(entry);
                userLists.update((l) => {
                    const newL = { ...l };
                    newL[list.id] = list.name;
                    return newL;
                });
            }
        }
    }
}


export async function saveList(list) {
    const fs = get(storageSettings).fs;
    if (fs.access && fs.dir) {
        const fileHandle = await fs.dir.getFileHandle(list.id, { create: true });
        // Create a FileSystemWritableFileStream to write to.
        const writable = await fileHandle.createWritable();
        // Write the contents of the file to the stream.
        await writable.write(JSON.stringify(list.toJSON()));
        // Close the file and write the contents to disk.
        await writable.close();
    }
    else if (window.localStorage) {
        console.log(`Saving List ${list.name} to the local storage`);
        let allShoppingLists = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_NAME));
        if (allShoppingLists == null || allShoppingLists == "null") {
            allShoppingLists = {};
        }
        allShoppingLists[list.id] = list.toJSON();
        window.localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(allShoppingLists));
    }
}


