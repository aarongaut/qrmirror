const { EnsembleCompressor } = require("./ensemble.js");
const { PakoCompressor } = require("./pako.js");
const { SmazCompressor } = require("./smaz.js");
const { XzCompressor } = require("./xz.js");

const compressor = new EnsembleCompressor();
compressor.register(120, new PakoCompressor());
compressor.register(121, new SmazCompressor());
// Currently broken
//compressor.register(122, new XzCompressor());

module.exports = { compressor };
