import { pncounterTest } from "./pncounter-editor.js";
import { awsetTest, bawsetTest, rosetTest } from "./awset-editor.js";
import { awmapTest } from "./map-editor.js";
console.log("Hello Progressive Web Apps");

const app = document.querySelector(".app");
const testCounter = pncounterTest(["a", "c", "d", "e"]);

const testBAWSet = bawsetTest(4);
const testAWSet = awsetTest(5);
const testROSet = rosetTest(4);
const testAWMAP = awmapTest(2);
/* app.appendChild(testCounter);
app.appendChild(testBAWSet);
app.appendChild(testROSet); */
app.appendChild(testAWSet);
app.appendChild(testAWMAP);