"use strict"

// Route for authentication

const User = require("../models/user");

const express = require("express");
const router = new express.Router();

const { createToken } = require("../helper/token");
const { BadRequestError } = require("../expressError");

const jsonschema = require("jsonschema");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");

/** POST /auth/token
 *  
 * Returns JWT token from user data.
 *  
 * Authorization required: none
 */
router.post("/token", async (req, res, next) => {
    try {
        const validator = jsonschema.validate(req.body, userAuthSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const { username, password } = req.body;
        const user = await User.authenticate(username, password);
        const token = createToken(user); 
        return res.json({ token });
    } catch (err) {
        return next(err);
    }
});

/** POST /auth/register
 *  
 * Returns JWT token from user data.
 *  
 * Authorization required: none
 */
router.post("/register", async (req, res, next) => {
    try {
        const validator = jsonschema.validate(req.body, userRegisterSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            console.debug(errs);
            throw new BadRequestError(errs);
        }

        const user = await User.register(req.body);
        const token = createToken(user);
        console.debug(token);
        return res.status(201).json({ token });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;