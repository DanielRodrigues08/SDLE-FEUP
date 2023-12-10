class ColorPicker {
    constructor(colors, active = null) {
        this.colors = colors;

        this.choices = {};
        this.element = this.buildColorPicker();
        this.active = null;
        if (active) {
            this.setActive(active);
        }
        this.active = active;
    }
    setActive(color) {
        if (this.active) {
            this.choices[this.active].toggleAttribute("active");
        }
        this.active = color;
        this.choices[this.active].toggleAttribute("active");
    }
    getActive() {
        return this.active;
    }

    buildColorPicker() {
        const container = document.createElement("div");
        container.className = "colorPicker";

        for (const color of this.colors) {
            const id = color;
            const choice = document.createElement("div");
            choice.id = id;
            choice.style.backgroundColor = color;
            choice.addEventListener("click", () => this.setActive(color));
            container.appendChild(choice);
            this.choices[color] = choice;
        }
        return container;
    }
}
export { ColorPicker };