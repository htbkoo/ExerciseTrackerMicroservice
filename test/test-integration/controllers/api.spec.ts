import request from "supertest";

import app from "../../../src/app";
import User from "../../../src/models/User";

describe("GET /api", () => {
    it("should return 200 OK", () => {
        return request(app).get("/api")
            .expect(200);
    });
});

describe("POST /api/exercise/add", function () {
    const user = new User({userId: "1", username: "some user name"});
    beforeEach(function () {
        user.save();
    });

    afterEach(function () {
        user.remove();
    });

    it("should return 200 OK if exercisePersistService.addExercise return OK", function () {
        // given
        const url = "/api/exercise/add";
        const params = {userId: "1", duration: 10, description: "some"};
        const data = Object.keys(params).map((key: keyof typeof params) => `${key}=${params[key]}`).join("&");

        // when
        // then
        const expectedResponse = {
            userId: "1",
            duration: 10,
            description: "some",
            username: "some user name",
            date: "2018-08-04"
        };
        return request(app)
            .post(url)
            .send(data)
            .expect(200, expectedResponse);
    });
});