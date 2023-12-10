var expect = require("chai").expect;


describe("Tester Ring endpoints", function () {
    // specification code
    var url = "http://localhost:3000/ring";

    it("Expect /ring to be 200", function () {
        request(url, function (error, response, body) {
            expect(response.statusCode).to.equal(200);
        });
    });

});