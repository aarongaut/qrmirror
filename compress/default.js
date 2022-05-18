const { EnsembleCompressor } = require("./ensemble.js");
const { ZlibCompressor } = require("./zlib.js");
const { SmazCompressor } = require("./smaz.js");
const { XzCompressor } = require("./xz.js");

const compressor = new EnsembleCompressor();
compressor.register(120, new ZlibCompressor());
compressor.register(121, new SmazCompressor());
// Currently broken
//compressor.register(122, new XzCompressor());

module.exports = { compressor };
