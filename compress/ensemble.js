class EnsembleCompressor {
  constructor() {
    this.compressors = {};
  }

  register(opcode, compressor) {
    this.compressors[opcode] = compressor;
  }

  compress(text) {
    let bestSize = Infinity;
    let bestOpcode = null;
    let bestData = null;
    for (const opcode in this.compressors) {
      const data = this.compressors[opcode].compress(text);
      if (data && data.length < bestSize) {
        if (this.compressors[opcode].decompress(data) !== text) {
          /* rejecting compressors whose solution changes the message after a
           * round trip. smaz is sometimes guilty of this, eg for non latin
           * characters.
           */
          continue;
        }
        bestSize = data.length;
        bestOpcode = opcode;
        bestData = data;
      }
    }
    if (!bestData) {
      throw Error("Failed to compress text");
    }
    const dataWithOpcode = new Uint8Array(bestData.length + 1);
    dataWithOpcode[0] = bestOpcode;
    dataWithOpcode.set(bestData, 1);
    return dataWithOpcode;
  }

  decompress(data) {
    const opcode = data[0];
    if (!(opcode in this.compressors)) {
      throw Error("Unknown opcode");
    }
    return this.compressors[opcode].decompress(data.slice(1));
  }
}

module.exports = { EnsembleCompressor };
