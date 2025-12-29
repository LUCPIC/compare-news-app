// This file acts as the entry point for the Vercel serverless function.
// It imports the Express app from the backend and exports it.
const app = require('../backend/server.js');

module.exports = app;
