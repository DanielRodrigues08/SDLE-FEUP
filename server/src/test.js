// ES6 imports/exports running in node
import { AWSet } from "crdts";
const a = new AWSet("a");

a.add("Daniel");
a.add("Rodrigues");
console.log(a.elements());

// node --experimental-default-type="module" test.js