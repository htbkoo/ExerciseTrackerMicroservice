import supertest from "supertest";
import app from "../../../../src/app";

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