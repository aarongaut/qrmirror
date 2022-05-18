const compressjs = require('compressjs');
const algorithm = compressjs.BWTC;

class BwtcCompressor {
  constructor() {
  }

  compress(text) {
    return Promise.resolve(algorithm.compressFile(Buffer.from(text, 'utf-8')));
  }

  decompress(data) {
    return Promise.resolve(Buffer.from(algorithm.decompressFile(data)).toString('utf-8'));
  }
}

module.exports = { BwtcCompressor };

