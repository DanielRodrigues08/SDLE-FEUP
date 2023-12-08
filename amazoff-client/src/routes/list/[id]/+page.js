import { get } from "svelte/store";
import { openedLists } from "../../stores";
//export const ssr = false;
export function load({ params }) {
    // will only return open list information
    const res = get(openedLists).lists[params.id];
    console.log(res);
    return res;
}