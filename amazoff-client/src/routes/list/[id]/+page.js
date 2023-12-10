import { get } from "svelte/store";
import { openedLists, storageSettings } from "../../stores";
import { getList } from "../../ShoppingListManager";
export async function load({ params }) {
    // will only return open list information
    const list = await getList(params.id);

    return { id: params.id };
}