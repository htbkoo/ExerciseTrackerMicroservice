import supertest from "supertest";
import HttpStatus from "http-status";

import app from "../../../../src/app";

describe("GET /api", () => {
    it("should redirect to /", () => {
        return supertest(app).get("/api")
            .expect(HttpStatus.FOUND)
            .expect("Location", "/");
    });
});

