import { pncounterTest } from "./pncounterTest.js";
import { bawsetTest } from "./awsetTest.js";
console.log("Hello Progressive Web Apps");

const app = document.querySelector(".app");
const testCounter = pncounterTest(["a", "b", "c", "d"]);

const testBAWSet = bawsetTest(4);
app.appendChild(testCounter);
app.appendChild(testBAWSet);