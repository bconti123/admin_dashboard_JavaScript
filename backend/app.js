"use strict";
const express = require("express");
const cors = require("cors");
const { NotFoundError } = require("./expressError");

// Routes
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

// app.use Routes
app.use("/auth", authRoutes);

// Health check
app.get("/", (req, res) => {
    return res.status(200).send("Server is running");
});

// Handle 404 error
app.use((req, res, next) => {
    return next(new NotFoundError());
});

// Handle general error
app.use((err, req, res, next) => {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;
  
    return res.status(status).json({
      error: { message, status },
    });
});

module.exports = app;