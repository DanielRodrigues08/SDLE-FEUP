import { syncControls } from "./syncer.js";
export const createTester = (editors, syncer) => {
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
    const app = document.createElement("div");
    app.className = "testContainer";
    app.appendChild(syncControls(syncer));
    app.appendChild(editorContainer);
    return app;
}