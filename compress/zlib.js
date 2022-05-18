const pako = require('pako');

// Port of zlib lossless compressor
class ZlibCompressor {
  constructor() {
  }

  compress(text) {
    return Promise.resolve(pako.deflate(text));
  }

  decompress(data) {
    if (data[0] !== 120) {
      /* This is a hack for backwards compatability. When pako was the only
       * compressor available, the compressed data we output was the exact
       * output of pako with no leading byte to indicate the compression
       * method. zlib, pako's underlying algorithm, always generates output
       * starting with 120. This means if we register PakoCompressor with
       * EnsembleCompressor using code 120, things that were previously
       * compressed with pako will be sent to the right place. However, the
       * EnsembleCompressor uses the first byte to route data to the right
       * compressor and so strips the byte off. The net effect is that old data
       * will be correctly sent to PakoCompressor, but the first byte will be
       * missing. We are re-adding it here.
       */
      const newData = new Uint8Array(data.length + 1);
      newData[0] = 120;
      newData.set(data, 1);
      data = newData;
    }
    return Promise.resolve(pako.inflate(data, { to: 'string' }));
  }
};

module.exports = { ZlibCompressor }
