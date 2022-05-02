const process = require('process');

const DOMAIN = process.env["QRMIRROR_HOST"] ?? "http://localhost:8000";

module.exports = {
  DOMAIN,
}
