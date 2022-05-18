/** A compressor that runs multiple compression algorithms and chooses the one
 * with the best compression ratio for each input. It prepends the output
 * buffer with 1-byte opcode indicating the compression algorithm which was
 * used for later decompression
 */
class EnsembleCompressor {
  constructor(options) {
    const { printStats } = options ?? {};
    this.printStats = printStats;
    this.compressors = {};
  }

  register(opcode, compressor) {
    this.compressors[opcode] = compressor;
  }

  compress(text) {
    const tryCompress = (compressor, text) => {
      return new Promise((resolve, reject) => {
        compressor.compress(text)
          .then(data => {
            if (!data) {
              reject("Data is falsey");
              return;
            }
            compressor.decompress(data)
              .then(roundTripText => {
                if (roundTripText === text) {
                  resolve(data);
                }
                else {
                  reject("Failed round trip");
                }
              })
              .catch(err => {
                reject(err)
              });
          })
          .catch(err => {
            reject(err)
          });
      });
    };

    return new Promise((resolve, reject) => {
      const opcodes = Object.keys(this.compressors);
      const promises = opcodes
        .map(opcode => tryCompress(this.compressors[opcode], text));

      Promise.allSettled(promises)
        .then(results => {
          let bestSize = Infinity;
          let bestOpcode = null;
          let bestData = null;
          for (let i = 0; i < results.length; i++) {
            const result = results[i];
            const opcode = opcodes[i];
            if (result.status !== "fulfilled") {
              if (this.printStats) {
                console.log(`${opcode} compr failed. reason: ${result.reason}`);
              }
              continue;
            }
            const data = result.value;
            if (this.printStats) {
              console.log(`${opcode} compr size: ${data.length}`);
            }
            if (data.length < bestSize) {
              bestSize = data.length;
              bestOpcode = opcode;
              bestData = data;
            }
          }
          if (!bestData) {
            reject("Failed to compress text");
            return;
          }
          const dataWithOpcode = new Uint8Array(bestData.length + 1);
          dataWithOpcode[0] = bestOpcode;
          dataWithOpcode.set(bestData, 1);
          resolve(dataWithOpcode);
        });
    });
  }

  decompress(data) {
    const opcode = data[0];
    if (!(opcode in this.compressors)) {
      return Promise.reject("Unknown opcode");
    }
    return this.compressors[opcode].decompress(data.slice(1));
  }
}

module.exports = { EnsembleCompressor };
