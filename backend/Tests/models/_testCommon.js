const bcrypt = require("bcrypt");
const db = require("../../db.js");
const { BCRYPT_WORK_FACTOR } = require("../../config.js");

const commonBeforeAll = async () => {
  await db.query("DELETE FROM user_roles WHERE role_id > 3");
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM roles WHERE id > 3");

  await db.query(
    `INSERT INTO users (id, username, password, first_name, last_name, email) 
     VALUES 
        (1, 'Root', $1, 'root', 'user', 'root@localhost.com'),
        (2, 'Admin', $2, 'admin', 'user', 'admin@localhost.com'),
        (3, 'User', $3, 'user', 'user', 'user@localhost.com')
      ON CONFLICT (id) DO NOTHING`,
    [
      await bcrypt.hash("rootpassword", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("adminpassword", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("userpassword", BCRYPT_WORK_FACTOR),
    ]
  );

  await db.query(
    `INSERT INTO roles (id, name, description) 
     VALUES 
        (1, 'root', 'Root role'),
        (2, 'admin', 'Admin role'),
        (3, 'user', 'User role'),
        (4, 'guest', 'Guest role'),
        (5, 'newRole', 'new role')
      ON CONFLICT (id) DO NOTHING`
  );

  await db.query(
    `INSERT INTO user_roles (user_id, role_id) 
     VALUES 
        ((SELECT id FROM users WHERE username = 'Root'), (SELECT id FROM roles WHERE name = 'root')),
        ((SELECT id FROM users WHERE username = 'Admin'), (SELECT id FROM roles WHERE name = 'admin')),
        ((SELECT id FROM users WHERE username = 'User'), (SELECT id FROM roles WHERE name = 'user'))`
  );
};

const commonBeforeEach = async () => {
  await db.query("BEGIN");
};

const commonAfterEach = async () => {
  await db.query("ROLLBACK");
};

const commonAfterAll = async () => {
  await db.end();
};

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};
