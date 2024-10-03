"use strict";

describe("configuration comes from other env", () => {
  test("works", () => {
    process.SECRET_KEY = "secret-dev";
    process.env.PORT = "5000";
    process.env.DATABASE_URL = "database_url";
    process.env.NODE_ENV = "other";
    process.env.BCRYPT_WORK_FACTOR = "12";

    const config = require("../config");

    expect(config.SECRET_KEY).toEqual("secret-dev");
    expect(config.PORT).toEqual(5000);
    expect(config.BCRYPT_WORK_FACTOR).toEqual(12);
    expect(config.getDatabaseUri()).toEqual("database_url");

    delete process.SECRET_KEY;
    delete process.env.PORT;
    delete process.env.BCRYPT_WORK_FACTOR;
    delete process.env.DATABASE_URL;
  });
});

describe("configuration comes from test env", () => {
  test("works", () => {
    process.env.NODE_ENV = "test";

    const config = require("../config");
    expect(process.env.NODE_ENV).toEqual("test");
    expect(config.getDatabaseUri()).toEqual("admin_test_db");

    delete process.env.NODE_ENV;
  });
});

describe("configuration comes from production env", () => {
  test("works", () => {
    process.env.NODE_ENV = "production";
    const config = require("../config");
    expect(process.env.NODE_ENV).toEqual("production");
    expect(config.getDatabaseUri()).toEqual("admin_db");
    delete process.env.NODE_ENV;
  });
});
