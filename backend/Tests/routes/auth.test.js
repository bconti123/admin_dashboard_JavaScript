"use strict";

const request = require("supertest");
const app = require("../../app");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


// Authentication tests
describe("POST /auth/token", () => {
    test("works", async () => {
        const response = await request(app)
            .post("/auth/token")
            .send({
                username: "Root",
                password: "root",
            });
        expect(response.body).toEqual({
            token: expect.any(String),
        });
    });

    test("unauth with bad credentials", async () => {
        const response = await request(app)
            .post("/auth/token")
            .send({
                username: "Root",
                password: "wrong",
            });
        expect(response.statusCode).toEqual(401);
    });

    test("bad request with schema", async () => {
        const response = await request(app)
            .post("/auth/token")
            .send({
                username: "Root",
            });
        expect(response.statusCode).toEqual(400);
        expect(response.error.message).toEqual(expect.any(String));
    });
});

// Registration tests
describe("POST /auth/register", () => {
    test("works", async () => {
        const response = await request(app)
            .post("/auth/register")
            .send({
                username: "NewUser",
                password: "newpassword",
                firstName: "new",
                lastName: "user",
                email: "new@localhost.com",
            });
        expect(response.body).toEqual({
            token: expect.any(String),
        });
    });

    test("bad request with schema", async () => {
        const response = await request(app)
            .post("/auth/register")
            .send({
                username: "NewUser",
                password: "newpassword",
                firstName: "new",
                lastName: "user",
            });
        expect(response.statusCode).toEqual(400);
        expect(response.error.message).toEqual(expect.any(String));
    });
});