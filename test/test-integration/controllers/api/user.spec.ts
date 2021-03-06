import HttpStatus from "http-status";

import User from "../../../../src/models/User";
import { postWithData } from "./util";
import { errorAssertion } from "./util";

const mockUuid = require("../../../../__mocks__/uuid/v4").mockUuidV4;

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

    it(`should return 400 BAD_REQUEST if username is missing in request`, function () {
        // given
        const params = {};

        // when
        // then
        return postAddUser(params)
            .expect(HttpStatus.BAD_REQUEST)
            .then(errorAssertion("cannot POST /api/exercise/new-user (400)", "username is missing"));
    });

    it(`should return 400 BAD_REQUEST if duplicated username is specified`, async function () {
        // given
        const params = {username: "duplicated username"};
        await new User({...params, userId: "randomUuid"}).save();

        // when
        // then
        return postAddUser(params)
            .expect(HttpStatus.BAD_REQUEST)
            .then(errorAssertion("cannot POST /api/exercise/new-user (400)", "'duplicated username' is already in use"));
    });

    function postAddUser(params: object) {
        return postWithData("/api/exercise/new-user", params);
    }
});