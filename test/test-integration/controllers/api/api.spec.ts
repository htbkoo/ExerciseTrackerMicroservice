import supertest from "supertest";
import HttpStatus from "http-status";

import app from "../../../../src/app";

describe("GET /api", () => {
    it("should return 200 OK", () => {
        return supertest(app).get("/api")
            .expect(HttpStatus.OK);
    });
});

export function postWithData(url: string, params: object): supertest.Test {
    const data: string = convertToPostData(params);
    return supertest(app)
        .post(url)
        .send(data);
}

export function errorAssertion(errorMessage: string, expected: string) {
    return (response: supertest.Response) => {
        const {error, text} = response;
        expect(error.message).toEqual(errorMessage);
        expect(text).toContain(expected);
    };
}

export function convertToPostData(params: object): string {
    return Object.keys(params).map((key: keyof typeof params) => `${key}=${params[key]}`).join("&");
}