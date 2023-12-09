import { get } from "svelte/store";
import { openedLists } from "../../stores";
//export const ssr = false;
export function load({ params }) {
    // will only return open list information
    //const res = get(openedLists).lists[params.id];
    // .....
    //..... \
    return {
        id: "0650905586",
        name: "Lista do Daniel",
        items: [
            {
                name: "Coca-Cola",
                desired: 2,
                purchased: 1,
            },
            {
                name: "Pepsi",
                desired: 1,
                purchased: 0,
            },
            {
                name: "Guaraná",
                desired: 1,
                purchased: 0,
            },
            {
                name: "Fanta",
                desired: 1,
                purchased: 0,
            },
            {
                name: "Sprite",
                desired: 3,
                purchased: 2,
            },
            {
                name: "Dr. Pepper",
                desired: 4,
                purchased: 3,
            },
            {
                name: "Mountain Dew",
                desired: 2,
                purchased: 1,
            },
            {
                name: "7UP",
                desired: 2,
                purchased: 0,
            },
            {
                name: "Root Beer",
                desired: 3,
                purchased: 2,
            }
        ]
    }
}