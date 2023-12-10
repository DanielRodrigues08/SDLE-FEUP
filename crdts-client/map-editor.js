import { BAWMap } from "crdts";
import { PNCounter } from "crdts";
import { AWSet } from "crdts";
import { createTester } from "./editor.js";
import { awsetEdit } from "./awset-editor.js"
import { counterEdit } from "./pncounter-editor.js";

const span = (text) => {
    const s = document.createElement("span");
    s.textContent = text;
    return s;
}

function mapEditor(map) {
    const editor = document.createElement("div");
    editor.className = "mapEditor";

    let elements = document.createElement("div");
    elements.className = "mapItems";

    const setElements = () => {
        const items = []
        for (const [key, value] of map.entries()) {
            const item = mapItem(key, value);
            const deleteItemButton = document.createElement("button");
            deleteItemButton.innerText = "-";
            deleteItemButton.addEventListener("click", (e) => {
                e.stopPropagation();
                map.remove(key);
                setElements();
            })
            const fullItem = document.createElement("div");
            fullItem.style.display = "flex";
            fullItem.appendChild(deleteItemButton);
            fullItem.appendChild(item);
            items.push(fullItem);
        }
        elements.replaceChildren(...items);
        console.log(map.entries());
    }
    const state = { isAdding: false };

    const addKeyComponent = document.createElement("input");
    addKeyComponent.type = "text";
    addKeyComponent.addEventListener("click", e => e.stopPropagation());

    const addValueComponent = document.createElement("select");
    addValueComponent.addEventListener("click", e => e.stopPropagation());
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
    const addItem = () => {
        const key = addKeyComponent.value
        addKeyComponent.value = "";
        if (key == "") {
            return;
        }
        const crdt = valueTypes[addValueComponent.value]();
        console.log(`Adding ${key} a ${addValueComponent.value}`);
        map.set(key, crdt);
        setElements();
    }
    addItemButton.addEventListener('click', (e) => {
        e.stopPropagation();
        addItem();
    })
    addKeyComponent.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            addItem();
            e.preventDefault();
        }
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
        state.isAdding = !state.isAdding;
        toggleAddItemButton.textContent = state.isAdding ? "-" : "+";
        toggleAddKeyValue();
    })

    const addContainer = document.createElement("div");
    addContainer.className = "mapAddItemContainer";

    addContainer.appendChild(toggleAddItemButton);
    addContainer.appendChild(addKeyValue);

    editor.appendChild(elements);
    editor.appendChild(addContainer);

    return { crdt: map, editor: editor, updateGroup: null, update: setElements };
}

function mapItem(key, value) {
    const item = document.createElement("div");
    item.className = "mapItem";


    const valueType = value.constructor ? value.constructor.name : typeof value;
    let valueComponent;
    if (value instanceof BAWMap) {
        const editor = mapEditor(value);
        valueComponent = editor.editor;
        editor.update()
    }

    else if (value instanceof AWSet) {
        const editor = awsetEdit(value);
        valueComponent = editor.editor;
        editor.update()

    } else if (value instanceof PNCounter) {
        const editor = counterEdit(value);
        valueComponent = editor.editor;
        editor.update();

    } else {
        valueComponent = span(`${valueType} cannot be a value of a CRDT Map`);
    }
    const valueTypeComponent = span(valueType);
    valueTypeComponent.style.fontStyle = "italic";

    const toggable = [valueComponent, valueTypeComponent];
    let fold = false;


    const keySpan = span(key + ": ")
    item.appendChild(keySpan);
    item.appendChild(valueComponent);
    item.addEventListener("click", (e) => {
        e.stopPropagation();
        console.log("Folding");
        item.replaceChild(toggable[!fold & 1], toggable[(fold) & 1]);
        fold = !fold;
    })
    return item;
}

export function mapNamedEditor(name) {
    const crdt = new BAWMap(name);
    const element = mapEditor(crdt);
    const updateGroup = null;
    const editor = document.createElement("div");
    editor.className = "editor";

    const header = document.createElement("span")
    header.innerText = `Map ${name}`;
    header.style.textAlign = "center";
    editor.appendChild(header);
    editor.appendChild(element.editor);
    return { ...element, editor: editor };

}

export function awmapTest(n) {
    const editors = [];
    for (let i = 0; i < n; i++) {
        editors.push(mapNamedEditor(i));
    };
    return createTester(editors, "AWMap")
}