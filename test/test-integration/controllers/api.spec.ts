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

    const user = new User({userId, username: "some user name"});
    beforeAll(function () {
        console.log("setup beforeAll for POST /api/exercise/add");
        jest.spyOn(datetimeService, "todayInUtc").mockImplementation(() => mockToday);
        return user.save();
    });

    afterAll(function () {
        console.log("teardown afterAll for POST /api/exercise/add");
        jest.restoreAllMocks();
        return user.remove();
    });

    [
        {
            isWithDate: "without date",
            params: {userId, duration: 10, description: "some"},
            expectedResponse: {
                userId,
                duration: 10,
                description: "some",
                username: "some user name",
                date: mockToday
            }
        },
        {
            isWithDate: "with date",
            params: {userId, duration: 11, description: "another", date: "2019-01-01"},
            expectedResponse: {
                userId,
                duration: 11,
                description: "another",
                username: "some user name",
                date: "2019-01-01"
            }
        },
    ].forEach(({isWithDate, params, expectedResponse}) =>
        it(`should return 200 OK if exercise (${isWithDate}) saved successfully`, function () {
            // given
            const data = convertToPostData(params);

            // when
            // then
            return postAddExercise(data)
                .expect(HttpStatus.OK, expectedResponse);
        })
    );

    [
        {missingField: "userId", validationMessage: "userId is missing"},
        {missingField: "description", validationMessage: "description is missing"},
        {missingField: "duration", validationMessage: "duration must be numeric"},
    ].forEach(({missingField, validationMessage}) =>
        it(`should return 500 INTERNAL_SERVER_ERROR if ${missingField} is missing in request`, function () {
            // given
            const params = {userId, duration: 11, description: "another", date: "2019-01-01"};
            // @ts-ignore
            delete params[missingField];
            const data = convertToPostData(params);

            // when
            // then
            return postAddExercise(data)
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .then(({error, text}) => {
                    expect(error.message).toEqual("cannot POST /api/exercise/add (500)");
                    expect(text).toContain(validationMessage);
                });
        })
    );

    it(`should return 500 INTERNAL_SERVER_ERROR if provided date is not in YYYY-MM-DD format`, function () {
        // given
        const params = {userId, duration: 11, description: "another", date: "some invalid format"};
        const data = convertToPostData(params);

        // when
        // then
        return postAddExercise(data)
            .expect(HttpStatus.INTERNAL_SERVER_ERROR)
            .then(({error, text}) => {
                expect(error.message).toEqual("cannot POST /api/exercise/add (500)");
                expect(text).toContain("date must be in YYYY-MM-DD format");
            });
    });

    function postAddExercise(data: string) {
        return request(app)
            .post("/api/exercise/add")
            .send(data);
    }
});

function convertToPostData(params: object): string {
    return Object.keys(params).map((key: keyof typeof params) => `${key}=${params[key]}`).join("&");
}