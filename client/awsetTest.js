import { BAWSet } from "./crdts/bawset.js";
import { createTester } from "./editorTest.js";

const editorContainer = document.createElement("div");
editorContainer.className = "editorContainer";
function awsetEdit(awset, n) {
    const editor = document.createElement("div");
    editor.className = "editor";

    const header = document.createElement("span")
    header.innerText = `BAWSet ${n}`;
    header.style.textAlign = "center";

    const contents = document.createElement("div");
    contents.className = "contents";

    const list = document.createElement("div");
    list.className = "list";

    const setElements = () => {
        let res = [];
        for (const el of awset.elements()) {
            const item = document.createElement("div");
            const p = document.createElement("p");
            p.innerText = el;
            item.className = "listItem";
            const deleteItem = document.createElement("button");
            deleteItem.innerText = "-";
            deleteItem.addEventListener("click", (e) => {
                console.log("Deleting " + el);
                e.stopPropagation();
                awset.remove(el);
                setElements();
            })
            item.appendChild(deleteItem);
            item.appendChild(p);

            res.push(item);
        }
        list.replaceChildren(...res);
    }
    const inputEl = document.createElement("input");
    inputEl.addEventListener("keypress", e => {
        if (e.key === "Enter" && inputEl.value != "") {
            e.preventDefault();
            awset.add(inputEl.value);
            inputEl.value = "";
            setElements();
        }
    });
    inputEl.addEventListener("click", e => e.stopPropagation());
    inputEl.type = "text";
    inputEl.style.display = "none";
    const addElementContainer = document.createElement("div");
    addElementContainer.className = "addElementContainer";
    const addButton = document.createElement("button");
    addButton.innerText = "+";
    let adding = false;
    addButton.addEventListener("click", (e) => {
        if (!adding) {
            addButton.innerHTML = "-";
            inputEl.style.display = "block";
            inputEl.focus();
        }
        else {
            inputEl.style.display = "none";
            addButton.innerHTML = "+";

        }
        adding = !adding;
        e.stopPropagation();
    });

    addElementContainer.appendChild(addButton);
    addElementContainer.appendChild(inputEl);

    contents.appendChild(list);
    contents.appendChild(addElementContainer);
    editor.appendChild(header);
    editor.appendChild(contents);
    return { editor: editor, update: setElements, crdt: awset };
}

export const bawsetTest = (n) => {
    const editors = [];
    for (let i = 0; i < n; i++) {
        const bawset = new BAWSet();
        editors.push(awsetEdit(bawset, i));
    }
    return createTester(editors, "Basic Add Wins Set");
}