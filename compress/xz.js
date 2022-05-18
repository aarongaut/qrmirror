const xz = require("xz");
// FIXME: currently failing with a "Engine in use" error
const stream = require("stream");

class XzCompressor {
  constructor() {
  }

  compress(text) {
    return new Promise((resolve, reject) => {
      try {
        const compressor = new xz.Compressor();
        stream.Readable.from(text).pipe(compressor).finalPromise()
          .then(data => resolve(data))
          .catch(err => reject(err));
      }
      catch (err) {
        reject(err);
      }
    });
  }

  decompress(data) {
    return new Promise((resolve, reject) => {
      try {
        const decompressor = new xz.Decompressor();
        stream.Readable.from(text).pipe(compressor).finalPromise()
          .then(buffer => {
            resolve(buffer.toString('utf-8'));
          })
          .catch(err => reject(err));
      }
      catch (err) {
        reject(err);
      }
    });
  }
};

module.exports = { XzCompressor };
