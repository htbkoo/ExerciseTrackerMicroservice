import request from "supertest";
import HttpStatus from "http-status";

import app from "../../../src/app";
import User from "../../../src/models/User";

import * as datetimeService from "../../../src/services/datetime/datetimeService";

describe("GET /api", () => {
    it("should return 200 OK", () => {
        return request(app).get("/api")
            .expect(HttpStatus.OK);
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
            .expect(HttpStatus.OK, expectedResponse);
    });
});

describe("POST /api/exercise/add", function () {
    const userId = "1";
    const mockToday = "2018-08-10";

    let user;
    beforeEach(function () {
        user = new User({userId, username: "some user name"});
        return user.save();
    });

    afterEach(function () {
        jest.restoreAllMocks();
        return user.remove();
    });

    it("should return 200 OK if exercise saved successfully", function () {
        // given
        jest.spyOn(datetimeService, "todayInUtc").mockImplementation(() => mockToday);

        const url = "/api/exercise/add";
        const params = {userId, duration: 10, description: "some"};
        const data = convertToPostData(params);

        // when
        // then
        const expectedResponse = {
            userId,
            duration: 10,
            description: "some",
            username: "some user name",
            date: mockToday
        };
        return request(app)
            .post(url)
            .send(data)
            .expect(HttpStatus.OK, expectedResponse);
    });
});

function convertToPostData(params: object): string {
    return Object.keys(params).map((key: keyof typeof params) => `${key}=${params[key]}`).join("&");
}