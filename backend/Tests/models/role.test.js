"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../../expressError.js");

const User = require("../../models/role.js");
const db = require("../../db.js");

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

describe("Get role", () => {
  test("works", async () => {
    const role = await User.get(1);
    expect(role).toEqual({
      id: 1,
      name: "root",
      description: "Root role",
    });
  });

  test("not found if no such role", async () => {
    try {
      await User.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("Get all roles", () => {
  test("works", async () => {
    const roles = await User.findAll();
    expect(roles.length).toEqual(5);
  });

  test("not found if no roles", async () => {
    jest.spyOn(db, "query").mockImplementationOnce(() => {
      return {
        rows: [],
      };
    });
    try {
      await User.findAll();
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("Create role", () => {
  test("works", async () => {
    const role = await User.create({ name: "new", description: "new role" });
    expect(role).toEqual({
      id: expect.any(Number),
      name: "new",
      description: "new role",
    });
  });

  test("bad request with duplicate role", async () => {
    try {
      const role = await User.create({
        name: "root",
        description: "Root role",
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

describe("Update role", () => {
  test("works", async () => {
    const role = await User.update(5, {
      name: "Updated",
      description: "updated role",
    });
    expect(role).toEqual({
      id: 5,
      name: "Updated",
      description: "updated role",
    });
  });

  test("bad request with duplicate role", async () => {
    try {
      await User.update(5, { name: "root", description: "Root role" });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test("not found if no such role", async () => {
    try {
      await User.update(100, { name: "notFound", description: "not found" });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with default role", async () => {
    try {
      await User.update(1, { name: "root", description: "Root role" });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

// Delete role
describe("Delete role", () => {
  test("works", async () => {
    const role = await User.delete(5);
    expect(role).toEqual({ id: 5 });
  });

  test("not found if no such role", async () => {
    try {
      await User.delete(100);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with default role", async () => {
    try {
      await User.delete(1);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});
