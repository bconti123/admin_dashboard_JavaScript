"use strict";

require("dotenv").config();
require("colors");

// server config
const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
const PORT = +process.env.PORT || 3001;

// database config
const getDatabaseUri = () => {
    return (process.env.NODE_ENV === "test")
    ? "admin_test_db"
    : process.env.DATABASE_URL || "admin_db";
};

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

// testing config
console.log("Admin Dashboard Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("Database:".yellow, getDatabaseUri());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);

// API config

module.exports = {
    SECRET_KEY,
    PORT,
    getDatabaseUri,
    BCRYPT_WORK_FACTOR
};