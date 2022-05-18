const smaz = require('@remusao/smaz');

// A simple compressor optimized for short english input
class SmazCompressor {
  constructor() {
  }

  compress(text) {
    return Promise.resolve(smaz.compress(text));
  }

  decompress(data) {
    return Promise.resolve(smaz.decompress(data));
  }
};

module.exports = { SmazCompressor }
