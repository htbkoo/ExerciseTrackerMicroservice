import request from "supertest";

import app from "../../../src/app";
import User from "../../../src/models/User";

import * as datetimeService from "../../../src/services/datetime/datetimeService";

describe("GET /api", () => {
    it("should return 200 OK", () => {
        return request(app).get("/api")
            .expect(200);
    });
});

describe("POST /api/exercise/new-user", function () {
    it("should return 200 OK if user created successfully", function () {
        // given
        const url = "/api/exercise/new-user";
        const params = {username: "username"};
        const data = convertToPostData(params);

        // when
        // then
        const expectedResponse = {
            userId: "someId",
            username: "username"
        };
        return request(app)
            .post(url)
            .send(data)
            .expect(200, expectedResponse);
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

    it("should return 200 OK if exercise saved successfully", function () {
        // given
        jest.spyOn(datetimeService, "todayInUtc").mockImplementation(() => "someDate");

        const url = "/api/exercise/add";
        const params = {userId: "1", duration: 10, description: "some"};
        const data = convertToPostData(params);

        // when
        // then
        const expectedResponse = {
            userId: "1",
            duration: 10,
            description: "some",
            username: "some user name",
            date: "someDate"
        };
        return request(app)
            .post(url)
            .send(data)
            .expect(200, expectedResponse);
    });
});

function convertToPostData(params: object): string {
    return Object.keys(params).map((key: keyof typeof params) => `${key}=${params[key]}`).join("&");
}