const lzma = require("lzma-native");

class XzCompressor {
  constructor() {
  }

  compress(text) {
    return lzma.compress(text);
  }

  decompress(data) {
    return lzma.decompress(data)
      .then(textBuffer => textBuffer.toString('utf-8'));
  }
};

module.exports = { XzCompressor };
