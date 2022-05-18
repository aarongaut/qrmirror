const process = require('process');

const PORT = process.env["QRMIRROR_PORT"] ?? 8000
const PREFIX = process.env["QRMIRROR_PREFIX"] ?? `http://localhost:${PORT}`;
const ENSEMBLE_STATS = !!process.env["QRMIRROR_ENSEMBLE_STATS"] || false;

module.exports = {
  PREFIX,
  PORT,
  ENSEMBLE_STATS,
};
