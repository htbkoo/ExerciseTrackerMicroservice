import request from "supertest";
import HttpStatus from "http-status";

import app from "../../../src/app";

describe("GET /", () => {
    it("should return 200 OK", (done) => {
        request(app).get("/")
            .expect(HttpStatus.OK, done);
    });
});
