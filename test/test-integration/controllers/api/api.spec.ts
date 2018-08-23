import supertest from "supertest";
import HttpStatus from "http-status";

import app from "../../../../src/app";

describe("GET /api", () => {
    it("should return 200 OK", () => {
        return supertest(app).get("/api")
            .expect(HttpStatus.OK);
    });
});

