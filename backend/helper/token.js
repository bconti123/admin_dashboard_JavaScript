const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { NotFoundError } = require("../expressError");

/** Create token from data.
 *
 * Returns JWT token from user data.
 *
 * Authorization required: none
 */

const createToken = (user) => {
  if (!user || !user.username || !user.role) {
    throw new NotFoundError("Missing or invalid user info");
  }

  let payload = {
    username: user.username,
    role: user.role,
    iat: Math.floor(Date.now() / 1000), // Issued At Time
  };
  const options = {
    expiresIn: "1h", // Token expires in 1 hour
  };
  return jwt.sign(payload, SECRET_KEY, options);
};

module.exports = { createToken };
