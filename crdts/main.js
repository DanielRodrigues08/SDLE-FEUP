import { PCounter } from "./pcounter.js";
import { PNCounter } from "./pncounter.js";
console.log("Testing CRDTs");

const a = new PNCounter("a");
a.increment();
a.increment();
a.decrement();
console.log(a.value());
const b = new PNCounter("b");
b.decrement();
b.merge(a);
console.log(b.value());

