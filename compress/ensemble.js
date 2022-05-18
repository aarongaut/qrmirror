class EnsembleCompressor {
  constructor() {
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
              continue;
            }
            const data = result.value;
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
