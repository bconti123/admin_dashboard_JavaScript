const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../../config");
const { createToken } = require("../../helper/token");
const { NotFoundError } = require("../../expressError");

describe("createToken", () => {
    test("works: not root/admin", async () => {
        const token = createToken({ username: "User", role: "user" });
        const payload = jwt.verify(token, SECRET_KEY);
        expect(payload.username).toEqual("User");
        expect(payload.role).toEqual("user");
    });

    test("works: root/admin", async () => {
        const token = createToken({ username: "Admin", role: "admin" });
        const payload = jwt.verify(token, SECRET_KEY);
        expect(payload.username).toEqual("Admin");
        expect(payload.role).toEqual("admin");
    });

    test("Not found if no user", async () => {
        try {
            createToken({});
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});
