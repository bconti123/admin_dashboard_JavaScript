"use strict";

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
  test("root works", async () => {
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

  test("unauthenticated if no user", async () => {
    try {
      await User.authenticate("BadUser", "password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("unauthenticated if wrong password", async () => {
    try {
      await User.authenticate("User", "wrongPassword");
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
  });
});

// Find All
describe("findAll", () => {
  test("works", async () => {
    const users = await User.findAll();
    expect(users).toEqual([
      {
        id: expect.any(Number),
        username: "Root",
        firstName: "root",
        lastName: "user",
        email: "root@localhost.com",
        role: "root",
        role_description: "Root role",
      },
      {
        id: expect.any(Number),
        username: "Admin",
        firstName: "admin",
        lastName: "user",
        email: "admin@localhost.com",
        role: "admin",
        role_description: "Admin role",
      },
      {
        id: expect.any(Number),
        username: "User",
        firstName: "user",
        lastName: "user",
        email: "user@localhost.com",
        role: "user",
        role_description: "User role",
      },
    ]);
  });
});

// Get Username
describe("get username", () => {
  test("works", async () => {
    const user = await User.get(1);
    expect(user).toEqual({
      id: expect.any(Number),
      username: "Root",
      firstName: "root",
      lastName: "user",
      email: "root@localhost.com",
      role: "root",
      role_description: "Root role",
    });
  });

  test("not found", async () => {
    try {
      await User.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

// Update
describe("update", () => {
  const UpdateData = {
    username: "UpdatedUser",
    firstName: "updated",
    lastName: "user",
    email: "updated@localhost.com",
  };

  test("works", async () => {
    const user = await User.update(1, UpdateData);
    expect(user).toEqual({
      id: expect.any(Number),
      username: "UpdatedUser",
      firstName: "updated",
      lastName: "user",
      email: "updated@localhost.com",
    });
  });

  test("works: SET Password", async () => {

    const checkPassword = await db.query(`SELECT * FROM users WHERE id = 1`);
    expect(checkPassword.rows.length).toEqual(1);

    const user = await User.update(1, {
      password: "newPassword",
    });
    expect(user).toEqual({
      id: expect.any(Number),
      username: "Root",
      firstName: "root",
      lastName: "user",
      email: "root@localhost.com",
    });

    const found = await db.query(`SELECT * FROM users WHERE id = 1`);
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password).not.toBeNull();
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
    expect(found.rows[0].password).not.toEqual(checkPassword.rows[0].password);
  });
});

// Delete
describe("delete", () => {
  test("works", async () => {
    const user = await User.delete(1);
    expect(user).toEqual({
      username: "Root"
    });

    const result = await db.query(`SELECT * FROM users WHERE id = 1`);
    expect(result.rows.length).toEqual(0);
  });

  test("not found", async () => {
    try {
      await User.delete(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

// Assign Role to username
describe("assignRole", () => {
  test("works", async () => {
    // check current role
    const result = await db.query(`SELECT * FROM user_roles WHERE user_id = 1`);
    expect(result.rows[0].role_id).toEqual(1);
    // assign new role
    const user = await User.assignRole(1, 2);
    expect(user.role_id).toEqual(2);
  });
});