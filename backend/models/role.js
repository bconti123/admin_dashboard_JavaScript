"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class Role {
  /** Get role.
   *
   * Returns {id, name, description}
   */
  static async get(id) {
    const result = await db.query(
      `SELECT id,
              name,
              description
       FROM roles
       WHERE id = $1`,
      [id]
    );

    const role = result.rows[0];

    if (!role) throw new NotFoundError(`No role found with id: ${id}`);

    return role;
  }

  /** Get all roles.
   *
   * Returns [{id, name, description}]
   */
  static async findAll() {
    const result = await db.query(
      `SELECT id,
              name,
              description
       FROM roles`
    );

    if (result.rows.length === 0) {
      throw new NotFoundError(`No roles found`);
    }
    return result.rows;
  }

  /** Create new role.
   *
   * Returns {id, name, description}
   */
  static async create({ name, description }) {
    const duplicateCheck = await db.query(
      `SELECT name
           FROM roles
           WHERE name = $1`,
      [name]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate role: ${name}`);
    }

    const result = await db.query(
      `INSERT INTO roles
           (name,
            description)
           VALUES ($1, $2)
           RETURNING id, name, description`,
      [name, description]
    );

    return result.rows[0];
  }

  /** Update role.
   *
   * Returns {id, name, description}
   */
  static async update(id, { name, description }) {

    const duplicateCheck = await db.query(
      `SELECT name
           FROM roles
           WHERE name = $1`,
      [name]
    );
    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate role: ${name}`);
    } 

    const result = await db.query(
      `UPDATE roles
           SET name = $1,
               description = $2
           WHERE id = $3
           RETURNING id, name, description`,
      [name, description, id]
    );

    if (!result.rows[0]) {
      throw new NotFoundError(`No role found with id: ${id}`);
    }

    return result.rows[0];
  }

  /** Delete role.
   *
   * Returns {id}
   */
  static async delete(id) {
    const checkRole = await db.query(
      `SELECT id
             FROM roles
             WHERE id = $1`,
      [id]
    );

    if (!checkRole.rows[0]) {
      throw new NotFoundError(`No role found`);
    }

    if (checkRole.rows[0].id < 4) {
      throw new BadRequestError(`Cannot delete default role`);
    }

    const result = await db.query(
      `DELETE
           FROM roles
           WHERE id = $1
           RETURNING id`,
      [checkRole.rows[0].id]
    );
    return result.rows[0];
  }
}

module.exports = Role;
