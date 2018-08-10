import request from "supertest";
import HttpStatus from "http-status";

import app from "../../src/app";

describe("GET /random-url", () => {
    it("should return 404", (done) => {
        request(app).get("/reset")
            .expect(HttpStatus.NOT_FOUND, done);
    });
});
