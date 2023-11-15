import { pncounterTest } from "./pncounterTest.js";
import { bawsetTest } from "./awsetTest.js";
console.log("Hello Progressive Web Apps");

const app = document.querySelector(".app");
const testCounter = pncounterTest(["a", "c", "d", "e","f"]);

const testBAWSet = bawsetTest(5);
app.appendChild(testCounter);
app.appendChild(testBAWSet);