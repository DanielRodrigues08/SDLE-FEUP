import { ROSet } from "../roset";
import { assertEquals } from "./testing";

function test_bottom() {
    const x = new ROSet();
    x.add("a");
    x.add("b");

    const bottom = new ROSet();
    x.merge(bottom);

    assertEquals(x.elements(), ["a", "b"]);
    assertEquals(bottom.elements(), []);

    bottom.merge(x);
    assertEquals(bottom.elements(), ["a", "b"]);
    assertEquals(x.elements(), ["a", "b"]);

}

function test_add() {
    const x = new ROSet();
    x.add("a");
    x.add("b");
    assertEquals(x.elements(), ["a", "b"]);
}
function test_remove() {
    const x = new ROSet();
    x.add("a");
    x.remove("a");
    // Should not readd the element
    x.add("a");
    assertEquals(x.elements(), []);
    assertEquals(x.contains("a"), false);
}
function test_addLoses() {
    const x = new ROSet();
    const y = new ROSet();
    x.add("a");
    y.merge(x);

    x.remove("a");
    y.merge(x);
    y.add("a");

    assertEquals(y.contains("a"), false);


}