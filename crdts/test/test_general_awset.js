import { assertEquals } from "./testing.js";

export function test_element_readdable(awset) {
    const s = awset("a");
    s.add("a");
    s.remove("a");
    assertEquals(s.contains("a"), false);

    s.add("a");
    assertEquals(s.contains("a"), true);

}
export function test_bottom(awset) {
    const s = awset("a");
    const bottom = awset("b");

    s.add("a");
    s.add("b");
    s.merge(bottom);

    assertEquals(s.elements(), ["a", "b"]);
    assertEquals(bottom.elements(), []);

    bottom.merge(s);
    assertEquals(bottom.elements().sort(), ["a", "b"]);
    assertEquals(s.elements().sort(), ["a", "b"]);

}

export function test_merge(awset) {
    const s = awset("a");
    s.add("a");
    s.add("b");

    const d = awset("d");
    d.add("c");
    d.add("d");

    s.merge(d);
    assertEquals(s.elements().sort(), ["a", "b", "c", "d"]);
    assertEquals(d.elements().sort(), ["c", "d"]);

    d.merge(s);
    assertEquals(d.elements().sort(), ["a", "b", "c", "d"]);
    assertEquals(s.elements().sort(), ["a", "b", "c", "d"]);
}

export function test_addWins(awset) {
    const s = awset("a");
    s.add("a");

    const d = awset("d");
    d.merge(s);

    d.add("a");
    s.remove("a");

    assertEquals(s.contains("a"), false);
    assertEquals(d.contains("a"), true);

    d.merge(s);
    s.merge(d);
    assertEquals(s.contains("a"), true);
    assertEquals(d.contains("a"), true);
}

export function test_concurrency(awset) {
    const s = awset("s");
    s.add("a");
    const d = awset("d");
    d.add("b");
    d.remove("a");

    // Add wins and consistency reached
    s.merge(d);
    d.merge(s);

    assertEquals(s.elements().sort(), d.elements().sort());
    assertEquals(s.elements().sort(), ["a", "b"]);

    // Now s is in the future of d so it is not an add in concurrency
    s.remove("a");
    d.merge(s);

    assertEquals(s.elements().sort(), d.elements().sort());
    assertEquals(s.elements().sort(), ["b"]);

    s.merge(d);

    d.remove("b");
    s.add("c");
    d.add("d");

    s.merge(d);
    d.merge(s);

    assertEquals(s.elements().sort(), d.elements().sort());
    assertEquals(s.elements().sort(), ["c", "d"]);

}