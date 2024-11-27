"use strict";

const db = require("../../db.js");

const User = require("../../models/user.js");
const { createToken } = require("../../helper/token");

const Role = require("../../models/role.js");

const commonBeforeAll = async () => {
  await db.query("DELETE FROM user_roles WHERE role_id > 3");
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM roles WHERE id > 3");

  // const rootRole = await Role.create({
  //   name: "root",
  //   description: "Root role",
  // });
  // const adminRole = await Role.create({
  //   name: "admin",
  //   description: "Admin role",
  // });
  // const userRole = await Role.create({
  //   name: "user",
  //   description: "User role",
  // });
  // const guestRole = await Role.create({
  //   name: "guest",
  //   description: "Guest role",
  // });
  // const newRole = await Role.create({
  //   name: "newRole",
  //   description: "new role",
  // });
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

  const rootRole = await Role.get(1);
  const adminRole = await Role.get(2);
  const userRole = await Role.get(3);
  const guestRole = await Role.get(4);
  const newRole = await Role.get(5);

  const root = await User.register({
    username: "Root",
    password: "root",
    firstName: "root",
    lastName: "user",
    email: "root@localhost.com",
  });
  const admin = await User.register({
    username: "Admin",
    password: "admin",
    firstName: "admin",
    lastName: "user",
    email: "admin@localhost.com",
  });
  const user = await User.register({
    username: "User",
    password: "user",
    firstName: "user",
    lastName: "user",
    email: "user@localhost.com",
  });

  await User.assignRole(root.id, rootRole.id);
  await User.assignRole(admin.id, adminRole.id);

  const rootUser = { username: root.username, role: rootRole.name };
  const adminUser = { username: admin.username, role: adminRole.name };
  const userUser = { username: user.username, role: userRole.name };

  const rootToken = createToken(rootUser);
  const adminToken = createToken(adminUser);
  const userToken = createToken(userUser);


  return { root, admin, user, rootToken, adminToken, userToken };
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
