import { get } from "svelte/store";
import { openedLists, storageSettings, userLists } from "./stores";
import { ShoppingList } from "./ShoppingList";
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
    const localStorageAccess = get(storageSettings).localStorage;
    if (fs.access && fs.dir) {
        const entry = await fsGetEntry(id);
        if (entry) {
            shoppingList = await loadListFromFile(entry);
        }
    }
    else if (localStorageAccess) {
        const list = window.localStorage.getItem(id);
        if (list !== "null") {
            shoppingList = ShoppingList.fromJSON(JSON.parse(list));
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

export async function createNewList(name,listId = null) {

    const list = new ShoppingList(name);
    if(listId !== null && listId !== ""){
        list.id = listId;
    }
    
    await saveList(list);
    return list;
}

export async function pollForNewLists() {
    const fs = get(storageSettings).fs;
    const all = get(userLists);
    if (fs.dir == null || !fs.access) {
        return null;
    }
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
    else if (get(storageSettings).localStorage) {
        console.log("Currently Not know how");
    }
}


