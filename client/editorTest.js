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
    app.appendChild(syncControls(syncer));
    app.appendChild(editorContainer);
    return app;
}