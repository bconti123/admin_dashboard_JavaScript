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
              email
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

    const duplicateEmailCheck = await db.query(
      `SELECT email
           FROM users
           WHERE email = $1`,
      [email]
    );

    if (duplicateEmailCheck.rows[0]) {
      throw new BadRequestError(`Duplicate email: ${email}`);
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

    const checkRole = await db.query(
      `SELECT id, name
           FROM roles
           WHERE id = $1`,
      [3]
    );

    if (!checkRole.rows[0]) {
      throw new BadRequestError(`No role found`);
    }

    // User role will be default.
    const user_roles = await db.query(
      `INSERT INTO user_roles (user_id, role_id)
      VALUES ($1, $2)
      RETURNING role_id`,
      [user.id, checkRole.rows[0].id]
    );

    user.role = checkRole.rows[0].name;

    return user;
  }

  /**
   * Given a username, get the user data.
   *
   * Returns {id, username, firstName, lastName, email, role}
   *
   * Throws NotFoundError if user not found.
   */

  static async get(id) {
    const userResult = await db.query(
      `SELECT u.id,
              u.username,
              u.first_name AS "firstName",
              u.last_name AS "lastName",
              u.email,
              r.name AS role,
              r.description AS role_description
       FROM users u
       LEFT JOIN user_roles ur ON u.id = ur.user_id
       LEFT JOIN roles r ON ur.role_id = r.id
       WHERE u.id = $1`,
      [id]
    );

    const user = userResult.rows[0];

    if (!user) throw new NotFoundError(`No user found with id: ${id}`);

    return user;
  }
  /** Get all users.
   *
   * Returns [{id, username, firstName, lastName, email, role}]
   */
  static async findAll() {
    const result = await db.query(
      `SELECT u.id,
              u.username,
              u.email,
              u.first_name AS "firstName",
              u.last_name AS "lastName",
              r.name AS role,
              r.description AS role_description
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id`
    );

    const user = result.rows;

    return user;
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data does not contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, password, email }
   *
   * Returns {username, firstName, lastName, email, role}
   *
   * Throws NotFoundError if not found.
   *
   * Throws BadRequestError on duplicates.
   */

  static async update(id, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(data, {
      firstName: "first_name",
      lastName: "last_name",
    });

    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols}
                      WHERE id = ${usernameVarIdx}
                      RETURNING id, 
                                username, 
                                first_name AS "firstName", 
                                last_name AS "lastName", 
                                email`;
    const result = await db.query(querySql, [...values, id]);

    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user found with id: ${id}`);

    return user;
  }

  /** Delete given user from database; returns undefined. */
  static async delete(id) {
    let result = await db.query(
      `DELETE
           FROM users
           WHERE id = $1
           RETURNING username`,
      [id]
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user found with id: ${id}`);

    return user;
  }

  /** Assign role to user */
  static async assignRole(user_id, role_id) {
    const result = await db.query(
      `INSERT INTO user_roles
      (user_id, role_id)
      VALUES ($1, $2)
      RETURNING role_id`,
      [user_id, role_id]
    );

    return result.rows[0];
  }
}

module.exports = User;
