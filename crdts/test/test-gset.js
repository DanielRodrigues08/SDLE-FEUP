import { GSet } from "../gset.js";
import { assertEquals } from "./testing.js";

function test_bottom() {
    const x = new GSet();
    x.add("a");
    x.add("b");

    const bottom = new GSet();

    x.merge(bottom);
    assertEquals(x.elements(), ["a", "b"]);

    bottom.merge(x);

    assertEquals(bottom.elements(), ["a", "b"]);
}

function test_idempotency() {
    const x = new GSet();
    x.add("a");
    x.add("b");

    for (let i = 0; i < 3; i++) {
        x.merge(x);
        assertEquals(x.elements(), ["a", "b"]);
    }
}

function test_commutative() {
    const getXY = () => {
        const x = new GSet();
        x.add("a");
        const y = new GSet();
        y.add("b");
        return [x, y];
    }

    let [x, y] = getXY();
    x.merge(y);
    assertEquals(x.elements(), ["a", "b"]);
    assertEquals(y.elements(), ["b"]);

    [x, y] = getXY();

    y.merge(x);
    assertEquals(y.elements(), ["a", "b"]);
    assertEquals(x.elements(), ["a"]);
}

function test_associativity() {

    const getXYZ = () => {
        const x = new GSet();
        x.add("a");
        const y = new GSet();
        y.add("b");
        const z = new GSet();
        z.add("c");
        return [x, y, z];
    }
    let [x, y, z] = getXYZ();
    x.merge(y);
    x.merge(z);
    assertEquals(x.elements(), ["a", "b", "c"]);
    assertEquals(y.elements(), ["b"]);
    assertEquals(z.elements(), ["c"]);

    [x, y, z] = getXYZ();
    y.merge(z);
    x.merge(y);
    assertEquals(x.elements(), ["a", "b", "c"]);
    assertEquals(y.elements(), ["b", "c"]);
    assertEquals(z.elements(), ["c"]);
}