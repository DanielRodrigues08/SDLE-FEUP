class Syncer {
    constructor() {
        this.delay = 0;
        this.currentAuto = null;
        this.auto = false;
        this.onTurnOn = () => { };
        this.onTurnOff = () => { };
        this.sync = () => { };
    }
    setAuto(turnOn) {
        if (turnOn) {
            if (this.auto) {
                clearInterval(this.currentAuto);
            }
            this.onTurnOn();
            this.currentAuto = setInterval(this.sync, this.delay * 1000);
        }
        else if (!turnOn && this.auto) {
            this.onTurnOff();
            clearInterval(this.currentAuto);
        }

        this.auto = turnOn;
    }
    setDelay(delay) {
        this.delay = delay;
        if (this.auto) {
            this.setAuto(true);
        }
    }
}

const syncDelayPicker = (s) => {
    const syncTimeSlider = document.createElement("input");
    syncTimeSlider.type = "range";
    syncTimeSlider.min = 0;
    syncTimeSlider.max = 20;
    syncTimeSlider.value = s.delay;
    const syncDelayView = document.createElement("p");
    const setDelay = (delay) => {
        syncDelayView.innerText = `Sync Delay ${delay}s`
        s.setDelay(delay);
    }
    syncTimeSlider.addEventListener("input", (e) => setDelay(Number(e.target.value)));
    setDelay(s.delay);

    const container = document.createElement("div");
    container.className = "syncDelayPicker";
    container.appendChild(syncDelayView);
    container.appendChild(syncTimeSlider);
    return container;
}

const syncButtons = (s) => {
    const syncButton = document.createElement("button");
    syncButton.innerText = `Sync`;
    syncButton.addEventListener("click", s.sync);
    const autoSync = document.createElement("input");
    autoSync.type = "checkbox";
    autoSync.addEventListener("input", (e) => s.setAuto(e.target.checked));
    const label = document.createElement("label");
    label.innerText = "Auto Sync: ";
    label.appendChild(autoSync);
    return [label, syncButton];
}

const syncControls = (s) => {
    const container = document.createElement("div");
    container.className = "syncControls";
    container.appendChild(syncDelayPicker(s));
    const [autoSync, sync] = syncButtons(s);
    container.appendChild(autoSync);
    container.appendChild(sync);
    return container;
}
export { Syncer, syncControls };