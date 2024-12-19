"use strict";

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../../config");
const { UnauthorizedError } = require("../../expressError");

const {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureCorrectUser,
} = require("../../middleware/auth");

const testjwt = jwt.sign({ username: "User", role: "user" }, SECRET_KEY);

describe("authenticateJWT", () => {
  test("works: via header", async () => {
    const req = { headers: { authorization: `Bearer ${testjwt}` } };
    const res = { locals: {} };
    const next = (err) => {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals.user).toEqual({
      iat: expect.any(Number),
      username: "User",
      role: "user",
    });
  });

  test("works: no header", async () => {
    const req = {};
    const res = { locals: {} };
    const next = (err) => {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals.user).toBeFalsy();
  });

  test("works: invalid token", async () => {
    const req = { headers: { authorization: "Bearer badtoken" } };
    const res = { locals: {} };
    const next = (err) => {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals.user).toBeFalsy();
  });
});

describe("ensureLoggedIn", () => {
  test("works", async () => {
    const req = { headers: { authorization: `Bearer ${testjwt}` } };
    const res = { locals: { user: { username: "User", role: "user" } } };
    const next = (err) => {
      expect(err).toBeFalsy();
    };
    ensureLoggedIn(req, res, next);
  });

  test("unauth if no login", async () => {
    const req = {};
    const res = { locals: {} };
    const next = (err) => {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureLoggedIn(req, res, next);
  });
});

describe("ensureAdmin", () => {
  test("works if admin", async () => {
    expect.assertions(1);
    const req = {};
    const res = { locals: { user: { username: "Admin", role: "admin" } } };
    const next = (err) => {
      expect(err instanceof UnauthorizedError).toBeFalsy();
    };
    ensureAdmin(req, res, next);
  });

  test("works if root", async () => {
    expect.assertions(1);
    const req = {};
    const res = { locals: { user: { username: "Root", role: "root" } } };
    const next = (err) => {
      expect(err instanceof UnauthorizedError).toBeFalsy();
    };
    ensureAdmin(req, res, next);
  });

  test("unauth if not admin/root", async () => {
    expect.assertions(1);
    const req = {};
    const res = { locals: { user: { username: "User", role: "user" } } };
    const next = (err) => {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureAdmin(req, res, next);
  });
});
