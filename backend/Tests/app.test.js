"use strict";

const request = require("supertest");
const app = require("../app");
const db = require("../db");

describe("GET /", () => {
  test("works", async function () {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });
});

describe("Not Found", () => {
  test("not found", async () => {
    const response = await request(app).get("/nope");
    expect(response.statusCode).toBe(404);
  });
});
