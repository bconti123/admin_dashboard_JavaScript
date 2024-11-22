"use strict";

const { sqlForPartialUpdate } = require("../../helper/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../../expressError");

const User = require("../../models/user");
const db = require("../../db");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
  } = require("./_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// Authentication
describe("authentication", () => {
  test ("root works", async () => { 
    const user = await User.authenticate("Root", "rootpassword");
    expect(user).toEqual({
      username: "Root",
      firstName: "root",
      lastName: "user",
      email: "root@localhost.com",
    });
  });
  test("admin works", async () => {
    const user = await User.authenticate("Admin", "adminpassword");
    expect(user).toEqual({
      username: "Admin",
      firstName: "admin",
      lastName: "user",
      email: "admin@localhost.com",
    });
  });
  test("user works", async () => {
    const user = await User.authenticate("User", "userpassword");
    expect(user).toEqual({
      username: "User",
      firstName: "user",
      lastName: "user",
      email: "user@localhost.com",
    });
  });

  test("bad username", async () => {
    try {
      await User.authenticate("BadUser", "password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

// Registration
describe("registration", () => {
  test("works", async () => {
    const user = await User.register({
      username: "NewUser",
      password: "newpassword",
      firstName: "new",
      lastName: "user",
      email: "new@localhost.com",
    });
    expect(user).toEqual({
      id: expect.any(Number),
      username: "NewUser",
      firstName: "new",
      lastName: "user",
      email: "new@localhost.com",
      role: "user",
    });
  });

  test("bad request with dup username", async () => {
    try {
      await User.register({
        username: "User",
        password: "newpassword",
        firstName: "new",
        lastName: "user",
        email: "new@localhost.com",
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test("bad request with dup email", async () => {
    try {
      await User.register({
        username: "NewUser",
        password: "newpassword",
        firstName: "new",
        lastName: "user",
        email: "user@localhost.com",
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    } 
  })
});


