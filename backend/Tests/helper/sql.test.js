const { sqlForPartialUpdate } = require("../../helper/sql");
const { BadRequestError } = require("../../expressError");

describe("sqlForPartialUpdate", () => {
  test("works: 1 item", () => {
    const result = sqlForPartialUpdate(
      { key1: "value1" },
      { key1: "key1", key2: "key2" }
    );
    expect(result).toEqual({
      setCols: '"key1"=$1',
      values: ["value1"],
    });
  });

  test("works: 2 items", () => {
    const result = sqlForPartialUpdate(
      { key1: "value1", key2: "value2" },
      { key2: "otherkey" }
    );
    expect(result).toEqual({
      setCols: '"key1"=$1,"otherkey"=$2',
      values: ["value1", "value2"],
    });
  });

  test("Bad request with no data", () => {
    expect(() => sqlForPartialUpdate({}, {})).toThrow(BadRequestError);
    expect(() => sqlForPartialUpdate({}, {})).toThrow("Bad Request");
  });
});
