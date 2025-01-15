"use strict";

// Route for users
const express = require("express");
const router = new express.Router();
const { BadRequestError } = require("../expressError");

// Models
const User = require("../models/user");
const { createToken } = require("../helper/token");

// Schemas
const jsonschema = require("jsonschema");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");

// Middleware
const { ensureAdmin, ensureCorrectUser } = require("../middleware/auth");

// POST / - Required Admin
router.post("/", ensureAdmin, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});

// GET / - Required Admin
router.get("/", ensureAdmin, async (req, res, next) => {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

// GET /:username - Required Admin or correct user
router.get("/:username", ensureCorrectUser, async (req, res, next) => {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

// PATCH /:username - Required Admin or correct user
router.patch("/:username", ensureCorrectUser, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const user = await User.update(req.params.username, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

// DELETE /:username - Required Admin or correct user
router.delete("/:username", ensureCorrectUser, async (req, res, next) => {
  try {
    await User.delete(req.params.username);
    return res.json({ deleted: req.params.username });
  } catch (err) {
    return next(err);
  }
});

// POST /:username/roles/:role_id - Required Admin or correct user
router.post(
  "/:username/roles/:role_id",
  ensureCorrectUser,
  async (req, res, next) => {
    try {
      await User.assignRole(req.params.username, req.params.role_id);
      return res.json({ assigned: req.params.username });
    } catch (err) {
      return next(err);
    }
  }
);

// Admin routes

// GET /admin/:username - Required Admin
router.get("/admin/:username", ensureAdmin, async (req, res, next) => {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

// PATCH /admin/:username - Required Admin
router.patch("/admin/:username", ensureAdmin, async (req, res, next) => {
  try {
    const user = await User.update(req.params.username, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

// DELETE /admin/:username - Required Admin
router.delete("/admin/:username", ensureAdmin, async (req, res, next) => {
  try {
    await User.delete(req.params.username);
    return res.json({ deleted: req.params.username });
  } catch (err) {
    return next(err);
  }
});

// POST /admin/:username/roles/:role_id - Required Admin
router.post(
  "/admin/:username/roles/:role_id",
  ensureAdmin,
  async (req, res, next) => {
    try {
      await User.assignRole(req.params.username, req.params.role_id);
      return res.json({ assigned: req.params.username });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
