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

    const list = document.createElement("ul");

    const setElements = () => {
        let res = "";
        for (const el of awset.elements()) {
            const item = `<li>${el}</li>`;
            res += item;
        }
        list.innerHTML = res;
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
    inputEl.type = "text";
    inputEl.style.display = "none";
    const addButton = document.createElement("button");
    addButton.innerText = "+";
    let adding = false;
    addButton.addEventListener("click", () => {
        if (!adding) {
            inputEl.style.display = "block";
            inputEl.focus();
        }
        else {
            inputEl.style.display = "none";

        }
        adding = !adding;
    });


    contents.appendChild(list);
    contents.appendChild(addButton);
    contents.append(inputEl);
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
    return createTester(editors, "counter");
}