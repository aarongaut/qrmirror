class TrivialCompressor {
  constructor() {
  }

  compress(text) {
    return Promise.resolve(Buffer.from(text, 'utf-8'));
  }

  decompress(data) {
    return Promise.resolve(data.toString('utf-8'));
  }
}

module.exports = { TrivialCompressor };
