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
        s.delay = delay;
        s.setAuto(true);
    }
    syncTimeSlider.addEventListener("input", (e) => setDelay(Number(e.target.value)));
    setDelay(s.delay);

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
    autoSync.addEventListener("input", (e) => s.setAuto(e.target.checked));
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
export { Syncer, syncControls };