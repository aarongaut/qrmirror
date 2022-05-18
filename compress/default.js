const { EnsembleCompressor } = require("./ensemble.js");
const { TrivialCompressor } = require("./trivial.js");
const { ZlibCompressor } = require("./zlib.js");
const { SmazCompressor } = require("./smaz.js");
const { XzCompressor } = require("./xz.js");
const { BwtcCompressor } = require("./bwtc.js");
const { ENSEMBLE_STATS } = require("../config.js");

const compressor = new EnsembleCompressor({ printStats: ENSEMBLE_STATS });

// Doesn't do any compression. This is a fallback if for whatever reason all
// the compressors behave poorly for a given input.
compressor.register(101, new TrivialCompressor());

// General purpose lossless compressor. Tends to perform the best for larger
// inputs but has some overhead that may dominate for shorter inputs.
// To be backward compatible with links generated pre-EnsembleCompressor, this
// compressor must be registered with opcode 120. See ZlibCompressor for
// details.
compressor.register(120, new ZlibCompressor());

// Compressor optimized for short english text. Tends to outperform other
// options for inputs within this niche, but sometimes fails to correctly
// round-trip.
compressor.register(121, new SmazCompressor());

// General purpose compressor similar to zlib.
// Disabled: In my testing xz generally has a slightly worse compression ratio
// than zlib without a niche where it performs better. Perhaps xz eventually
// overtakes zlib for large enough input, but it doesn't seem to be worth it
// for this application.
//compressor.register(122, new XzCompressor());

// General purpose compressor.
// This compressor achieves a similar compression ratio to zlib and somtimes
// slightly better. Enabling it doesn't make a huge difference, but may allow
// for slightly larger inputs when we are hitting the limit of what can fit in
// a QR code
compressor.register(123, new BwtcCompressor());

module.exports = { compressor };
