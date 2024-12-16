'use strict';

const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const { UnauthorizedError } = require('../expressError');

/** Middleware: Authenticate user.
 * 
 * If a token was provided, verify it, and, if valid, store the token payload
 * 
 * Throw UnauthorizedError if:
 * - a token was not provided
 * - provided token was not valid
 * - no matching user
 * 
 * This should be used at the start of any route that needs to be protected.
 */

const authenticateJWT = async (req, res, next) => {
    try {
        const authHeader = req.headers && req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace(/^[Bb]earer /, '').trim();
            const payload = jwt.verify(token, SECRET_KEY);
            res.locals.user = payload;
        }
        return next();
    } catch (err) {
        return next();
    }
};

/** Middleware to ensure user is logged in
 * 
 * Calls next() if otherwise.
 * 
 */

const ensureLoggedIn = async (req, res, next) => {
    try {
        if (!res.locals.user) throw new UnauthorizedError();
        return next();
    } catch (err) {
        return next(err);
    }
};

/** Middleware to ensure user is admin/root user (default role)
 * 
 * Calls next() if otherwise.
 * 
 */

const ensureAdmin = async (req, res, next) => {
    try {
        if (res.locals.user.role !== 'admin' || res.locals.user.role !== 'root') throw new UnauthorizedError();
        return next();
    } catch (err) {
        return next(err);
    }
};

/** Middleware to ensure user has higher level role user
 * 
 * UnauthorizedError if:
 * - Level lower than other role.
 * 
 */

const ensureHigherRole = async (req, res, next) => {
    try {
        if (res.locals.user.role_id > 2) throw new UnauthorizedError();
        return next();
    } catch (err) {
        return next(err);
    }
};
