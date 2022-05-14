const smaz = require('@remusao/smaz');

// A simple compressor optimized for short english input
class SmazCompressor {
  constructor() {
  }

  compress(text) {
    return smaz.compress(text);
  }

  decompress(data) {
    return smaz.decompress(data);
  }
};

module.exports = { SmazCompressor }
