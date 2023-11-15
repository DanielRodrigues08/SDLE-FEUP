import { PNCounter } from "./crdts/pncounter.js";
import { createTester } from "./editorTest.js";

function counterEdit(counter) {
    const edit = document.createElement("div");
    edit.className = "editor";

    const header = document.createElement("span")
    header.innerText = `Counter ${counter.tag}`;
    header.style.textAlign = "center";

    const inc = document.createElement("button");
    inc.innerText = "+";
    const dec = document.createElement("button");
    dec.innerText = "-";

    const controls = document.createElement("div");
    controls.className = "controls";

    const val = document.createElement("span");
    val.style.textAlign = "center";
    const setVal = () => {
        val.innerText = "Value: " + counter.value();
    }
    setVal();

    edit.appendChild(header);
    edit.appendChild(controls);

    controls.appendChild(inc);
    controls.appendChild(val);
    controls.appendChild(dec);

    inc.addEventListener("click", () => {
        counter.increment();
        setVal();
    })
    dec.addEventListener("click", () => {
        counter.decrement();
        setVal();
    })
    return { editor: edit, update: setVal, crdt: counter };
}

export const pncounterTest = (tags) => {
    const editors = [];
    for (const tag of tags) {
        const counter = new PNCounter(tag);
        const obj = counterEdit(counter);
        editors.push(obj);
    }

    return createTester(editors, "counters");
}