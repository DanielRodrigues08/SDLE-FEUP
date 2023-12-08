import { writable } from "svelte/store";

export const openedLists = writable([{ id: 1, name: "Exemplo" }]);

