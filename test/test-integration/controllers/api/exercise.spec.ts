import supertest from "supertest";
import HttpStatus from "http-status";

import app from "../../../../src/app";
import User from "../../../../src/models/User";
import * as datetimeService from "../../../../src/services/datetime/datetimeService";
import Exercise from "../../../../src/models/Exercise";
import { convertToPostData, errorAssertion, postWithData } from "./api.spec";

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

    it(`should return 500 INTERNAL_SERVER_ERROR if userId matches no existing user`, function () {
        // given
        const params = {userId: "some non-existent Id", duration: 11, description: "another"};

        // when
        // then
        return postAddExercise(params)
            .expect(HttpStatus.INTERNAL_SERVER_ERROR)
            .then(assertErrorMessage("userId &#39;some non-existent Id&#39; matches no user"))
            .then(() => Exercise.find({userId: "some non-existent Id"}))
            .then(exercises => expect(exercises.length).toEqual(0));
    });

    function postAddExercise(params: object) {
        return postWithData("/api/exercise/add", params);
    }

    function assertErrorMessage(expected: string) {
        return errorAssertion("cannot POST /api/exercise/add (500)", expected);
    }
});

describe("GET /api/exercise/log?{userId}[&from][&to][&limit]", function () {
    // TODO: improve how we get userId/username (e.g. delegate to factory) to avoid conflicting with other tests
    const userId = "userId1", username = "someName1";
    const SMALL_PAUSE = 50;
    const exercises = {
        first: {userId, duration: 1, description: "any", date: "2018-08-15"},
        second: {userId, duration: 2, description: "2nd", date: "2017-01-01"},
        fourth: {userId, duration: 4, description: "four", date: "2018-01-04"},
    };
    const logs = {
        first: {duration: 1, description: "any", date: "Wed, Aug 15, 2018"},
        second: {duration: 2, description: "2nd", date: "Sun, Jan 01, 2017"},
        fourth: {duration: 4, description: "four", date: "Thu, Jan 04, 2018"},
    };
    jest.setTimeout(10000);

    beforeAll(async function () {
        await new User({userId, username}).save();
        await addExercises([
            exercises.first,
            exercises.second,
            exercises.fourth,
        ]);
    });
    afterAll(async function () {
        await User.findOneAndRemove({username});
        await Exercise.find({userId}).remove().exec();
    });

    describe("successful cases", function () {
        it(`should return 200 OK if exercises are retrieved (shown in reversed insertion order) successfully`, async function () {
            const expectedResponse = {
                userId,
                username,
                count: 3,
                log: [
                    {duration: 4, description: "four", date: "Thu, Jan 04, 2018"},
                    {duration: 2, description: "2nd", date: "Sun, Jan 01, 2017"},
                    {duration: 1, description: "any", date: "Wed, Aug 15, 2018"},
                ]
            };
            return getExerciseLog(`?userId=${userId}`)
                .expect(HttpStatus.OK, expectedResponse);
        });

        it(`should return 200 OK and show the latest log only when limited by 1`, async function () {
            const expectedResponse = {
                userId,
                username,
                count: 1,
                log: [
                    {duration: 4, description: "four", date: "Thu, Jan 04, 2018"},
                ]
            };
            return getExerciseLog(`?${convertToPostData({userId, limit: 1})}`)
                .expect(HttpStatus.OK, expectedResponse);
        });

        [
            {
                testCase: "limited by from (exact date)",
                expectedCount: 2,
                expectedLog: [logs.fourth, logs.first],
                otherParams: {from: "2018-01-04"}
            },
            {
                testCase: "limited by to (exact date)",
                expectedCount: 2,
                expectedLog: [logs.fourth, logs.second],
                otherParams: {to: "2018-01-04"}
            },
            {
                testCase: "limited by both from and to (exact date)",
                expectedCount: 1,
                expectedLog: [logs.second],
                otherParams: {from: "2017-01-01", to: "2017-01-01"}
            },
            {
                testCase: "limited by both from and to (not exact date)",
                expectedCount: 3,
                expectedLog: [logs.fourth, logs.second, logs.first],
                otherParams: {from: "2012-01-04", to: "2028-01-04"}
            },
        ].forEach(({testCase, expectedCount, expectedLog, otherParams}) =>
            it(`should return 200 OK and show the matched logs only when ${testCase}`, async function () {
                const expectedResponse = {
                    userId,
                    username,
                    count: expectedCount,
                    log: expectedLog
                };
                return getExerciseLog(`?${convertToPostData({userId, ...otherParams})}`)
                    .expect(HttpStatus.OK, expectedResponse);
            })
        );
    });

    describe("failed cases", function () {
        [
            {
                testCase: "userId is missing in request",
                param: "",
                error: "cannot GET /api/exercise/log (500)",
                message: "userId is missing"
            },
            {
                testCase: "limit (when provided) is not numeric",
                param: `?${convertToPostData({userId: "a", limit: "not numeric"})}`,
                error: "cannot GET /api/exercise/log?userId=a&limit=not%20numeric (500)",
                message: "limit must be numeric"
            },
            {
                testCase: "from (when provided) is not in YYYY-MM-DD format",
                param: `?${convertToPostData({userId: "a", from: "18-Aug-2018"})}`,
                error: "cannot GET /api/exercise/log?userId=a&from=18-Aug-2018 (500)",
                message: "date must be in YYYY-MM-DD format"
            },
            {
                testCase: "to (when provided) is not in YYYY-MM-DD format",
                param: `?${convertToPostData({userId: "a", to: "18-Aug-2018"})}`,
                error: "cannot GET /api/exercise/log?userId=a&to=18-Aug-2018 (500)",
                message: "date must be in YYYY-MM-DD format"
            },
        ].forEach(({testCase, param, error, message}) =>
            it(`should return 500 INTERNAL_SERVER_ERROR if ${testCase}`, function () {
                return getExerciseLog(param)
                    .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                    .then(errorAssertion(error, message));
            })
        );
    });

    function addExercises(exercises: any[]): Promise<void> {
        return exercises.reduce((promise, doc) => promise.then(async () => {
            await pause(SMALL_PAUSE);
            await addExercise(doc);
        }), Promise.resolve());
    }

    async function pause(timeout: number) {
        console.debug("before pause");
        await new Promise(resolve => setTimeout(resolve, timeout));
        console.debug("resolved pause");
    }

    async function addExercise(doc: any) {
        const result = await new Exercise(doc).save();
        console.debug(`saved doc: ${JSON.stringify(result)}`);
    }

    function getExerciseLog(param: string) {
        return supertest(app)
            .get(`/api/exercise/log${param}`);
    }
});
