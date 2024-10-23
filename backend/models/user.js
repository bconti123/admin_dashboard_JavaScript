"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helper/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config");

class User {
  /** authenticate user with username, password.
   *
   * Returns { username, first_name, last_name, email, role }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT username,
                  password,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
           FROM users
           WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns { username, firstName, lastName, email, role }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register({ username, password, firstName, lastName, email }) {
    const duplicateCheck = await db.query(
      `SELECT username
           FROM users
           WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
           (username,
            password,
            first_name,
            last_name,
            email)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, username, first_name AS "firstName", last_name AS "lastName", email`,
      [username, hashedPassword, firstName, lastName, email]
    );

    const user = result.rows[0];
    // User role will be default.
    const user_roles = await db.query(
      `INSERT INTO user_roles
      (user_id, role_id)
      VALUES ($1, $2)
      RETURNING role_id`,
      [user.id, 3]
    );

    user.role = user_roles.rows[0];

    return user;
  }
/*** Get Username */
  static async get(id) {
    const userResult = await db.query(
      `SELECT u.id,
              u.username,
              u.first_name,
              u.last_name,
              u.email,
              r.name AS role_name,
              r.description AS role_description
       FROM users u
       LEFT JOIN user_roles ur ON u.id = ur.user_id
       LEFT JOIN roles r ON ur.role_id = r.id
       WHERE u.username = $1`,
      [id]
    );

    const user = userResult.rows[0];

    if (!user) throw new NotFoundError(`no user found: ${username}`);

    // // Check Role ID
    // const checkRoleId = await db.query(
    //   `SELECT role_id
    //    FROM user_roles
    //    WHERE user_id = $1`,
    //   [user.id]
    // );
    // // Get Role with name and description
    // const role = await db.query(
    //   `SELECT name,
    //           description
    //    WHERE role_id = $1`,
    //   [checkRoleId.rows[0].role_id]
    // );

    // user.role_name = role.name;
    // user.role_description = role.description;

    return user;
  }
}
