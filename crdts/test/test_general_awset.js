import { assertEquals } from "./testing";

export function test_element_readdable() {
    const s = awset("a");
    s.add("a");
    s.remove("a");
    assertEquals(s.contains("a"), false);

    s.add("a");
    assertEquals(s.contains("a"), true);

}
export function test_bottom() {
    const s = awset("a");
    const bottom = awset("b");

    s.add("a");
    s.add("b");
    s.merge(bottom);

    assertEquals(s.elements(), ["a", "b"]);
    assertEquals(bottom.elements(), []);

    bottom.merge(s);
    assertEquals(bottom.elements(), ["a", "b"]);
    assertEquals(s.elements(), ["a", "b"]);

}

export function test_merge() {
    const s = awset("a");
    s.add("a");
    s.add("b");

    const d = awset("d");
    d.add("c");
    d.add("d");

    s.merge(d);
    assertEquals(s.elements(), ["a", "b", "c", "d"]);
    assertEquals(d.elements(), ["c", "d"]);

    d.merge(s);
    assertEquals(d.elements(), ["a", "b", "c", "d"]);
    assertEquals(s.elements(), ["a", "b", "c", "d"]);
}

export function test_addWins() {
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

export function test_concurrency() {
    const s = awset("s");
    s.add("a");
    const d = awset("d");
    d.add("b");
    d.remove("a");

    // Add wins and consistency reached
    s.merge(d);
    d.merge(s);

    assertEquals(s.elements(), d.elements());
    assertEquals(s.elements(), ["a", "b"]);

    // Now s is in the future of d so it is not an add in concurrency
    s.remove("a");
    d.merge(s);

    assertEquals(s.elements(), d.elements());
    assertEquals(s.elements(), ["b"]);

    s.merge(d);

    d.remove("b");
    s.add("c");
    d.add("d");

    s.merge(d);
    d.merge(s);

    assertEquals(s.elements(), d.elements());
    assertEquals(s.elements(), ["c", "d"]);

}