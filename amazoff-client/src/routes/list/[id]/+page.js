import { get } from "svelte/store";
import { openedLists, storageSettings } from "../../stores";
//export const ssr = false;
export function load({ params }) {
    // will only return open list information
    const res = get(openedLists).lists[params.id];
    // List already loaded
    if (res) {
        return res;
    }

    // Load New List

    const fs = get(storageSettings).fs;
    if (fs.access && fs.dir) {

    }
    else {

    }
    return res;
}