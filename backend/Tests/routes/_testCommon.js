"use strict";

const database = require("../../db.js");

const User = require("../../models/user.js");
const { createToken } = require("../../helper/token");

const Role = require("../../models/role.js");

const commonBeforeAll = async () => {
  await database.cleanAllTables();

  const rootRole = await Role.create({
    name: "root",
    description: "Root role",
  });
  const adminRole = await Role.create({
    name: "admin",
    description: "Admin role",
  });
  const userRole = await Role.create({
    name: "user",
    description: "User role",
  });
  const guestRole = await Role.create({
    name: "guest",
    description: "Guest role",
  });
  const newRole = await Role.create({
    name: "newRole",
    description: "new role",
  });

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
  
  const rootToken = createToken({
    username: root.username,
    role: rootRole.name,
  });
  const adminToken = createToken({
    username: admin.username,
    role: adminRole.name,
  });
  const userToken = createToken({
    username: user.username,
    role: userRole.name,
  });

  return { root, admin, user, rootToken, adminToken, userToken };
};
