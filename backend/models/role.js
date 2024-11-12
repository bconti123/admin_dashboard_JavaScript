"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class Role {
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

    return role;
  }
  static async findAll() {
    const result = await db.query(
      `SELECT id,
              name,
              description
       FROM roles`
    );

    return result.rows;
  }

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

  static async update(id, { name, description }) {
    const result = await db.query(
      `UPDATE roles
           SET name = $1,
               description = $2
           WHERE id = $3
           RETURNING id, name, description`,
      [name, description, id]
    );

    return result.rows[0];
  }

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
