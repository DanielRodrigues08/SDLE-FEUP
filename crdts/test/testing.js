
export function assertEquals(a, b) {
    if (a != b) {
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
        results[i].then(result => {
            if (result) {
                const testName = `${filePath}::${names[i]}`;
                console.log(testName + " passed!");
            }
            else {
                console.log(testName + " dind't pass!");
            }

        })
    }

}
