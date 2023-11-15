import { Syncer, syncControls } from "./syncer.js";
import { ColorPicker } from "./colorPicker.js";
export const createTester = (editors, syncerName) => {
    const editorContainer = document.createElement("div");
    editorContainer.className = "editorContainer";

    let colors = ["#d0fffe",
        "#fffddb",
        "#e4ffde",
        "#ffd3fd",
        "#ffe7d3"];
    const getColor = (i) => {
        if (i < colors.length) {
            return colors[i];
        }
        return "black";
    }
    // A mapping from color => list of editors
    const groups = {}
    const setEditorGroup = (editor, color) => {
        editor.updateGroup = color;
        editor.editor.style.backgroundColor = color;
    }
    let i = 0;
    for (const editor of editors) {
        const color = getColor(i);
        setEditorGroup(editor, color);
        groups[color] = true;
        editorContainer.appendChild(editor.editor);
        i++;
    }
    const colorPicker = new ColorPicker(Object.keys(groups), getColor(0));
    for (const editor of editors) {
        editor.editor.addEventListener("click", (e) => {
            if (e.shiftKey) {
                const activeColor = colorPicker.getActive();
                editor.updateGroup = activeColor;
                editor.editor.style.backgroundColor = activeColor;
            }
        })
        editorContainer.appendChild(editor.editor);

    }
    const syncer = new Syncer();
    syncer.what = syncerName;
    syncer.sync = () => {
        const toUpdate = [];
        for (const editor of editors) {
            if (editor.shouldUpdate) {
                toUpdate.push(editor);
            }
        }
        for (const sender of toUpdate) {
            for (const receiver of toUpdate) {
                receiver.crdt.merge(sender.crdt);
                receiver.update();
            }
        }
    }
    syncer.onTurnOn = function () {
        console.log(`Syncing ${this.what} every ${this.delay} seconds`);
    }
    syncer.onTurnOff = function () {
        console.log(`Switched off autosync on ${this.what}`);

    }
    const app = document.createElement("div");
    app.className = "testContainer";
    const controls = document.createElement("div");
    controls.className = "controls";
    controls.appendChild(syncControls(syncer));
    controls.appendChild(colorPicker.element);
    app.appendChild(controls);
    app.appendChild(editorContainer);
    return app;
}