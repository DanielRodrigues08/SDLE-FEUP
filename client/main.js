import { pncounterTest } from "./pncounterTest.js";
import { awsetTest, bawsetTest, rosetTest } from "./awsetTest.js";
console.log("Hello Progressive Web Apps");

const app = document.querySelector(".app");
const testCounter = pncounterTest(["a", "c", "d", "e"]);

const testBAWSet = bawsetTest(4);
const testAWSet = awsetTest(5);
const testROSet = rosetTest(4);
app.appendChild(testCounter);
app.appendChild(testBAWSet);
app.appendChild(testAWSet);
app.appendChild(testROSet);