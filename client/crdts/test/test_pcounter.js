import { PCounter } from "../pcounter.js";
import { assertEquals } from "./testing.js";


export function test_count() {
    const c = new PCounter("c");
    c.increment();
    c.increment(2);
    assertEquals(c.value(), 3);
}

export function test_bottom() {
    const c = new PCounter("c");
    const bottom = new PCounter("d");

    c.increment(2);
    c.merge(bottom);

    assertEquals(c.value(), 2);
    assertEquals(bottom.value(), 0);

    bottom.merge(c);
    assertEquals(c.value(), 2);
    assertEquals(bottom.value(), 2);
}

export function test_merge() {
    const c = new PCounter("c");
    c.increment(3);

    const d = new PCounter("d");
    d.merge(c);
    d.increment();

    assertEquals(d.value(), 4);
}

export function test_concurrent() {
    const c = new PCounter("c");
    c.increment(3);

    const d = new PCounter("d");
    d.merge(c);

    d.increment(2);
    c.increment();

    assertEquals(d.value(), 5);
    assertEquals(c.value(), 4);

    d.merge(c);
    c.merge(d);

    // Eventual consistency
    assertEquals(d.value(), 6);
    assertEquals(c.value(), 6);
}

export function test_retransmissions() {
    const c = new PCounter("c");
    const d = new PCounter("d");

    c.increment(3);
    d.increment(4);

    c.merge(d);
    c.merge(d);
    d.merge(c);
    c.merge(d);
    d.merge(c);

    assertEquals(c.value(), 7);
    assertEquals(d.value(), 7);
}