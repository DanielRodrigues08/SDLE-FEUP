import { Syncer, syncControls } from "./syncer.js";
export const createTester = (editors, syncerName) => {
    const editorContainer = document.createElement("div");
    editorContainer.className = "editorContainer";

    for (const editor of editors) {
        editor.shouldUpdate = false;
        editor.editor.addEventListener("click", (e) => {
            if (e.shiftKey) {
                editor.shouldUpdate = !editor.shouldUpdate;
                editor.editor.toggleAttribute("toUpdate");
            }
        })
        editorContainer.appendChild(editor.editor);
    }
    const buildColorPicker = (colors) => {
        const container = document.createElement("div");
        container.className = "colorPicker";
        const choices = {};
        let active = null;

        const setActive = (color) => {
            if (active) {
                choices[active].toggleAttribute("active");
            }
            active = color;
            choices[active].toggleAttribute("active");

        }
        for (const color of colors) {
            const id = color;
            const choice = document.createElement("div");
            choice.id = id;
            choice.style.backgroundColor = color;
            choice.addEventListener("click", (e) => {
                console.log(e)
                setActive(color);
            });
            container.appendChild(choice);
            choices[color] = choice;
        }
        return container;
    }
    const colorPicker = buildColorPicker(["red", "white", "blue"]);


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
    controls.appendChild(colorPicker);
    app.appendChild(controls);
    app.appendChild(editorContainer);
    return app;
}