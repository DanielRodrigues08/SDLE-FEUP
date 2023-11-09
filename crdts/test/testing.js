
export function assertEquals(a, b) {
    if (a != b) {
        throw new Error(`${a} does not equal ${b}`);
    }
}