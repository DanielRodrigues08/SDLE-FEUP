import { CausalContext } from "../causalcontext";
import { assertEquals } from "./testing";

function test_next() {
    const context = new CausalContext();
    const [tag, count] = context.next("a");
    assertEquals(tag, "a");
    assertEquals(count, 1);
}

function test_max() {
    const context = new CausalContext();
    assertEquals(context.max("a"), 0);

    for (let i = 0; i < 3; i++) {
        context.next("a");
    }
    assertEquals(context.max("a"), 3);
}