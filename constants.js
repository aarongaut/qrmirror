const process = require('process');

const PORT = process.env["QRMIRROR_PORT"] ?? 8000
const PREFIX = process.env["QRMIRROR_PREFIX"] ?? `http://localhost:${PORT}`;

module.exports = {
  PREFIX,
  PORT,
};
