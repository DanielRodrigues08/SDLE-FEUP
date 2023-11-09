import { assertEquals } from "./testing.js";

export function test_should_fail() {
    assertEquals(1, 2);

}

export function test_should_pass() {
    assertEquals(1, 1);
}