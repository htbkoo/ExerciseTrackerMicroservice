import supertest from "supertest";
import HttpStatus from "http-status";

import app from "../../../src/app";

describe("GET /", () => {
    it("should have url query param populated if missing", () => {
        return supertest(app).get("/")
            .expect(HttpStatus.FOUND)
            .expect("Location", "/?url=swagger/swagger.json");
    });

    it("should return 200 OK if url query param is already populated", () => {
        supertest(app).get("/?url=someUrl")
            .expect(HttpStatus.OK);
    });
});
