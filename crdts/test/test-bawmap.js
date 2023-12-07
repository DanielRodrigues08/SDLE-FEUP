import { BAWMap } from "../bawmap.js";
import { PNCounter } from "../pncounter.js";
import { assertEquals } from "./testing.js";

const initialize = () => {
    const toTest = new BAWMap("teste");
    toTest.set("peras", new PNCounter("teste"));
    toTest.get("peras").increment(3);

    const toTest1 = new BAWMap("teste1");
    toTest1.set("peras", new PNCounter("teste1"));
    toTest1.get("peras").decrement(2);
    toTest1.set("bananas", new PNCounter("teste1"));
    toTest1.get("bananas").increment(2);

    const toTest2 = new BAWMap("teste2");
    toTest2.set("kiwis", new PNCounter("teste2"));
    toTest2.get("kiwis").increment(5);
    toTest2.set("bananas", new PNCounter("teste2"));
    toTest2.get("bananas").increment(3);

    return [toTest, toTest1, toTest2];
}

export function test_bottom() {
    const bottom = new BAWMap("bottom");
    const toTest = new BAWMap("teste");
    toTest.set("peras", new PNCounter("teste"));
    toTest.get("peras").increment(3);

    toTest.merge(bottom);
    assertEquals(toTest.keys(), ["peras"]);
    assertEquals(toTest.get("peras").value(), 3);

    assertEquals(bottom.keys(), []);

}

export function test_commutative() {

    let [a, b] = initialize()

    a.merge(b);
    assertEquals(a.keys().toSorted(), ["bananas", "peras"]);
    assertEquals(b.keys().toSorted(), ["bananas", "peras"]);

    assertEquals(a.get("peras").value(), 1);
    assertEquals(b.get("peras").value(), -2);
    assertEquals(b.get("bananas").value(), 2);

    [a, b] = initialize();

    b.merge(a);


    assertEquals(a.keys().toSorted(), ["peras"]);
    assertEquals(b.keys().toSorted(), ["bananas", "peras"]);

    assertEquals(a.get("peras").value(), 3);
    assertEquals(b.get("peras").value(), 1);
    assertEquals(b.get("bananas").value(), 2);
}

export function test_idempotency() {
    let [a] = initialize();

    a.merge(a);

    assertEquals(a.keys(), ["peras"]);
    assertEquals(a.get("peras").value(), 3);
}

export function test_associativity() {
    let [a, b, c] = initialize();

    debugger;
    // (a op b) op c
    a.merge(b);
    a.merge(c);

    assertEquals(a.keys().toSorted(), ["bananas", "kiwis", "peras"]);
    assertEquals(a.get("bananas").value(), 5);
    assertEquals(a.get("kiwis").value(), 5);
    assertEquals(a.get("peras").value(), 1);


    [a, b, c] = initialize();
    // a op (b op c)
    b.merge(c);
    a.merge(b);

    assertEquals(a.keys().toSorted(), ["bananas", "kiwis", "peras"]);
    assertEquals(a.get("bananas").value(), 5);
    assertEquals(a.get("kiwis").value(), 5);
    assertEquals(a.get("peras").value(), 1);

}

export function test_remove() {
    const toTest = new BAWMap("teste");
    toTest.set("peras", new PNCounter("teste"));
    toTest.get("peras").increment(2);

    const toTest1 = new BAWMap("teste1");
    toTest1.merge(toTest);

    assertEquals(toTest1.contains("peras"), true);
    assertEquals(toTest1.get("peras").value(), 2);

    toTest1.remove("peras");
    assertEquals(toTest1.contains("peras"), false);

    // After update it should be removed
    toTest.merge(toTest1);
    toTest1.merge(toTest);

    assertEquals(toTest1.contains("peras"), false);
    assertEquals(toTest.contains("peras"), false);



}

export function test_add_wins() {
    const toTest = new BAWMap("teste");
    toTest.set("peras", new PNCounter("teste"));
    toTest.get("peras").increment(2);

    const toTest1 = new BAWMap("teste1");
    toTest1.merge(toTest);
    assertEquals(toTest1.contains("peras"), true);
    assertEquals(toTest1.get("peras").value(), 2);

    toTest1.remove("peras");
    assertEquals(toTest1.contains("peras"), false);

    debugger;
    toTest.set("peras", new PNCounter("teste"));
    toTest.get("peras").increment(2);

    // Add should win
    toTest.merge(toTest1);
    toTest1.merge(toTest);

    assertEquals(toTest1.contains("peras"), true);
    assertEquals(toTest.contains("peras"), true);
}

export function test_complex() {

    let [a, b, c] = initialize();

    a.merge(b);
    a.merge(c);

    b.merge(a);
    c.merge(a);
    // all should be the same
    for (const map of [a, b, c]) {
        assertEquals(map.keys().toSorted(), ["bananas", "kiwis", "peras"]);
        assertEquals(map.get("bananas").value(), 5);
        assertEquals(map.get("kiwis").value(), 5);
        assertEquals(map.get("peras").value(), 1);
    }

    a.merge(b);
    b.merge(a);
    c.merge(b);
    // all should be the same
    for (const map of [a, b, c]) {
        assertEquals(map.keys().toSorted(), ["bananas", "kiwis", "peras"]);
        assertEquals(map.get("bananas").value(), 5);
        assertEquals(map.get("kiwis").value(), 5);
        assertEquals(map.get("peras").value(), 1);
    }

}
export function test_nested() {
    const newListItem = (t) => {
        const item = new BAWMap(t);
        item.set("wish", new PNCounter(t));
        item.set("have", new PNCounter(t));
        return item;
    }
    const listA = new BAWMap("a");
    listA.set("peras", newListItem("a"));

    listA.get("peras").get("wish").increment(4);
    listA.get("peras").get("have").increment();


    const listB = new BAWMap("b");
    listB.set("peras", newListItem("b"));
    listB.set("bananas", newListItem("b"));

    listB.get("peras").get("have").increment();
    listB.get("bananas").get("wish").increment();


    listA.merge(listB);

    assertEquals(listA.keys().toSorted(), ["bananas", "peras"]);
    assertEquals(listA.get("peras").get("have").value(), 2);
    assertEquals(listA.get("peras").get("wish").value(), 4);
    assertEquals(listA.get("bananas").get("have").value(), 0);
    assertEquals(listA.get("bananas").get("wish").value(), 1);
}