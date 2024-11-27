"use strict";

const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
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
});