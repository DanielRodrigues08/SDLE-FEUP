
export function assertEquals(a, b) {

    if (a != b && JSON.stringify(a) != JSON.stringify(b)) {
        throw new Error(`${a} does not equal ${b}`);
    }
}

function getTestFuncs(module) {
    const res = [];
    for (const exported in module) {
        res.push([module[exported], exported]);
    }
    return res;
}

async function runTest(testFunc, file, funcName) {
    let passed = true
    try {
        testFunc();
    } catch (e) {
        console.error(`Exception While testing ${file}::${funcName} -> ${e}`)
        console.error(e.stack);
        passed = false;
    }
    return passed;
}

export async function testFile(filePath) {
    const testModule = await import(filePath);
    const testFuncs = getTestFuncs(testModule);
    const results = [];
    const names = [];
    for (const [func, name] of testFuncs) {
        const result = runTest(func, filePath, name);
        results.push(result);
        names.push(name);
    }
    Promise.allSettled(results);
    for (let i = 0; i < names.length; i++) {
        // As it was settled above it will imediatly return
        const testName = `${filePath}::${names[i]}`;
        results[i].then(result => {
            if (result) {
                console.log(testName + " passed!");
            }
            else {
                console.log(testName + " dind't pass!");
            }

        })
    }

}

// TODO: discover test files inside a test folder
// TODO: discovery should be based on test_ prefix so test-general-awset names should change