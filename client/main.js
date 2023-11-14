import { PNCounter } from "./crdts/pncounter.js";
console.log("Hello Progressive Web Apps");


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
    return { editor: edit, update: setVal, counter: counter };
}
const editorContainer = document.createElement("div");
editorContainer.className = "editorContainer";

const tags = ["a", "b", "c", "d", "a"];
const editors = [];
for (const tag of tags) {
    const counter = new PNCounter(tag);
    const obj = counterEdit(counter);
    editors.push(obj);
    editorContainer.appendChild(obj.editor);
}

const syncer = {
    autoSync: false,
    previousAutoSync: null,
    syncDelay: 4,
    sync: null,
    setAutoSync: null,
};

const doSync = () => {
    for (const sender of editors) {
        for (const receiver of editors) {
            receiver.counter.merge(sender.counter);
            receiver.update();
        }
    }

}
syncer.sync = () => {
    console.log(syncer);
    doSync();
}
syncer.setAutoSync = (turnOn) => {
    if (turnOn) {
        // Remove Previous
        if (syncer.autoSync) {
            clearInterval(syncer.previousAutoSync);
        }
        console.log("Syncing every " + syncer.syncDelay + " seconds");
        syncer.previousAutoSync = setInterval(syncer.sync, syncer.syncDelay * 1000);
    }
    if (!turnOn && syncer.autoSync) {
        console.log("Removed Syncing");
        clearInterval(syncer.previousAutoSync);
    }
    syncer.autoSync = turnOn;
}

const syncDelayPicker = (s) => {
    const syncTimeSlider = document.createElement("input");
    syncTimeSlider.type = "range";
    syncTimeSlider.min = 0;
    syncTimeSlider.max = 20;
    syncTimeSlider.value = s.syncDelay;
    const syncDelayView = document.createElement("p");
    const setDelay = (delay) => {
        syncDelayView.innerText = `Sync Delay ${delay}s`
        s.syncDelay = delay;
        s.setAutoSync(true);
    }
    syncTimeSlider.addEventListener("input", (e) => setDelay(Number(e.target.value)));
    setDelay(s.syncDelay);

    const container = document.createElement("div");
    container.class = "syncDelayPicker";
    container.appendChild(syncTimeSlider);
    container.appendChild(syncDelayView);
    return container;
}

const syncButtons = (s) => {
    const syncButton = document.createElement("button");
    syncButton.innerText = "Sync Counters";
    syncButton.addEventListener("click", s.sync);
    const autoSync = document.createElement("input");
    autoSync.type = "checkbox";
    autoSync.addEventListener("input", (e) => s.setAutoSync(e.target.checked));
    const label = document.createElement("label");
    label.innerText = "Auto Sync: ";
    label.appendChild(autoSync);
    const container = document.createElement("div");
    container.appendChild(syncButton);
    container.appendChild(label);
    return container;
}

const syncControls = (s) => {
    const container = document.createElement("div");
    container.appendChild(syncDelayPicker(s));
    container.appendChild(syncButtons(s));
    return container;
}


const app = document.querySelector(".app");
app.appendChild(syncControls(syncer));
app.appendChild(editorContainer);