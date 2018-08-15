import supertest from "supertest";
import HttpStatus from "http-status";

import app from "../../../src/app";
import User from "../../../src/models/User";
import * as datetimeService from "../../../src/services/datetime/datetimeService";

const mockUuid = require("../../../__mocks__/uuid/v4").mockUuidV4;

describe("GET /api", () => {
    it("should return 200 OK", () => {
        return supertest(app).get("/api")
            .expect(HttpStatus.OK);
    });
});

describe("POST /api/exercise/new-user", function () {
    const duplicatedUserName = "duplicated username";
    afterAll(function () {
        User.findOneAndRemove({username: duplicatedUserName});
    });

    it("should return 200 OK if user created successfully", function () {
        // given
        const params = {username: "username"};

        // when
        // then
        const expectedResponse = {
            userId: mockUuid,
            username: "username"
        };
        return postAddUser(params)
            .expect(HttpStatus.OK, expectedResponse);
    });

    it(`should return 500 INTERNAL_SERVER_ERROR if username is missing in request`, function () {
        // given
        const params = {};

        // when
        // then
        return postAddUser(params)
            .expect(HttpStatus.INTERNAL_SERVER_ERROR)
            .then(errorAssertion("cannot POST /api/exercise/new-user (500)", "username is missing"));
    });

    it(`should return 500 INTERNAL_SERVER_ERROR if duplicated username is specified`, async function () {
        // given
        const params = {username: "duplicated username"};
        await new User({...params, userId: "randomUuid"}).save();

        // when
        // then
        return postAddUser(params)
            .expect(HttpStatus.INTERNAL_SERVER_ERROR)
            .then(errorAssertion("cannot POST /api/exercise/new-user (500)", "&#39;duplicated username&#39; is already in use"));
    });

    function postAddUser(params: object) {
        return postWithData("/api/exercise/new-user", params);
    }
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
            return postAddExercise(params)
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
            const invalidParams: any = {userId, duration: 11, description: "another", date: "2019-01-01"};
            delete invalidParams[missingField];

            // when
            // then
            return postAddExercise(invalidParams)
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .then(assertErrorMessage(validationMessage));
        })
    );

    it(`should return 500 INTERNAL_SERVER_ERROR if provided date is not in YYYY-MM-DD format`, function () {
        // given
        const params = {userId, duration: 11, description: "another", date: "some invalid format"};

        // when
        // then
        return postAddExercise(params)
            .expect(HttpStatus.INTERNAL_SERVER_ERROR)
            .then(assertErrorMessage("date must be in YYYY-MM-DD format"));
    });

    function postAddExercise(params: object) {
        return postWithData("/api/exercise/add", params);
    }

    function assertErrorMessage(expected: string) {
        return errorAssertion("cannot POST /api/exercise/add (500)", expected);
    }
});

function postWithData(url: string, params: object): supertest.Test {
    const data: string = convertToPostData(params);
    return supertest(app)
        .post(url)
        .send(data);
}

function errorAssertion(errorMessage: string, expected: string) {
    return (response: supertest.Response) => {
        const {error, text} = response;
        expect(error.message).toEqual(errorMessage);
        expect(text).toContain(expected);
    };
}

function convertToPostData(params: object): string {
    return Object.keys(params).map((key: keyof typeof params) => `${key}=${params[key]}`).join("&");
}