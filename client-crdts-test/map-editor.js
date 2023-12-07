import { BAWMap } from "crdts";
import { PNCounter } from "crdts";
import { AWSet } from "crdts";
import { createTester } from "./editor.js";

const span = (text) => {
    const s = document.createElement("span");
    s.textContent = text;
    return s;
}

function mapEditor(map) {
    const editor = document.createElement("div");
    editor.className = "editor";

    let elements = document.createElement("div");
    elements.className = "mapItems";

    const setElements = () => {
        const items = []
        for (const [key, value] of map.entries()) {
            const item = mapItem(key, value);
            items.push(item);
        }
        elements.replaceChildren(...items);
        console.log(map.entries());
    }
    const state = { isAdding: false };

    const addKeyComponent = document.createElement("input");
    addKeyComponent.type = "text";

    const addValueComponent = document.createElement("select");
    const valueTypes = {
        "AddWins Set": () => new AWSet(),
        "Add Wins Map": () => new BAWMap(),
        "PNCounter": () => new PNCounter(),
    }
    for (const valueType of Object.keys(valueTypes)) {
        const option = document.createElement("option");
        option.value = valueType;
        option.textContent = valueType;
        addValueComponent.appendChild(option);
    }

    const addItemButton = document.createElement("button");
    addItemButton.textContent = "+";
    addItemButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const key = addKeyComponent.value
        addKeyComponent.value = "";
        if (key == "") {
            return;
        }
        const crdt = valueTypes[addValueComponent.value]();
        console.log(`Adding ${key} a ${addValueComponent.value}`);
        map.set(key, crdt);
        setElements();
    })

    const addKeyValue = document.createElement("div");
    addKeyValue.className = "addKeyValueComponent";
    addKeyValue.style.display = "none";
    const toggleAddKeyValue = () => {
        addKeyValue.style.display = state.isAdding ? "block" : "none";

    }

    addKeyValue.appendChild(addKeyComponent);
    addKeyValue.appendChild(addValueComponent);
    addKeyValue.appendChild(addItemButton);

    const toggleAddItemButton = document.createElement("button");
    toggleAddItemButton.textContent = "+";
    toggleAddItemButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleAddItemButton.textContent = state.isAdding ? "-" : "+";
        state.isAdding = !state.isAdding;
        toggleAddKeyValue();
    })

    const addContainer = document.createElement("div");
    addContainer.className = "mapAddItemContainer";

    addContainer.appendChild(toggleAddItemButton);
    addContainer.appendChild(addKeyValue);

    editor.appendChild(elements);
    editor.appendChild(addContainer);

    return editor;
}

function mapItem(key, value) {
    const item = document.createElement("div");
    item.className = "mapItem";

    let valueComponent;
    if (value instanceof BAWMap) {
        valueComponent = span("Building a BawMap item");
    }

    else if (value instanceof AWSet) {
        valueComponent = span("building a awset item")

    } else if (value instanceof PNCounter) {
        valueComponent = span("building a pncounter item")

    } else {
        const valueType = value.constructor ? value.constructor.name : typeof value;
        valueComponent = span(`${valueType} cannot be a value of a CRDT Map`);

    }
    const keySpan = span(key + ": ")
    keySpan.addEventListener("click", (e) => {
        e.stopPropagation();
        console.log(`Folding Item of key ${key}`)
    });
    item.appendChild(keySpan);
    item.appendChild(valueComponent);
    return item;
}

export function awmapTest(n) {
    const editors = [];
    for (let i = 0; i < n; i++) {
        const crdt = new BAWMap(i);
        const element = mapEditor(crdt);
        const updateGroup = null;
        editors.push({ crdt: crdt, editor: element, updateGroup: updateGroup });
    };
    return createTester(editors, "AWMap")
}