import { PNCounter } from "../pncounter";
import { assertEquals } from "./testing";

function test_increment() {
    const c = new PNCounter("c");
    c.increment(3);
    c.increment();
    assertEquals(c.value(), 4);

}
function test_decrement() {
    const c = new PNCounter("c");
    c.decrement(3);
    c.decrement();
    assertEquals(c.value(), -4);

}
function test_combination() {
    const c = new PNCounter("c");
    c.decrement(3);
    c.increment()
    assertEquals(c.value(), -2);
}


function test_bottom() {
    const c = new PNCounter("c");
    c.decrement(2);

    const bottom = new PNCounter("b");
    c.merge(bottom);
    assertEquals(c.value(), -2);
    assertEquals(bottom.value(), 0);

    bottom.merge(c);
    assertEquals(bottom.value(), -2);
    assertEquals(c.value(), -2);
}

function test_concurrent() {
    const c = new PNCounter("c");
    const d = new PNCounter("d");

    c.increment();

    d.merge(c);
    d.decrement(2);

    c.increment();

    c.merge(d);
    assertEquals(c.value(), 0);
    assertEquals(d.value(), -1);

    d.merge(c);
    assertEquals(c.value(), 0);
    assertEquals(d.value(), 0);


}

function test_retransmissions() {

    const c = new PNCounter("c");
    const d = new PNCounter("d");

    c.increment(4);
    d.decrement(3);
    d.merge(c);
    d.increment();
    c.decrement();

    d.merge(c);
    d.merge(c);
    c.merge(d);
    d.merge(c);
    c.merge(d);

    assertEquals(d.value(), 1);
    assertEquals(c.value(), 1);

}