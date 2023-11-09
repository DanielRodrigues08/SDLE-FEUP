
let crdts = import("./crdts.js").then(m => crdts = m);

let test = import("./test/testing.js").then(m => {
    test = m;
    test.testFile("./test_pcounter.js")
});