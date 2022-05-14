const fs = require('fs');
const path = require('path');
const md = require('markdown-it')();
const QRCode = require('qrcode');
const { Base64 } = require('js-base64');

const { PREFIX } = require('./config.js');

const { compressor } = require('./compress/default.js');

const decodeData = (req, res, next) => {
  if (!Base64.isValid(res.locals.b64data)) {
    next({
      statusCode: 400,
      clientErrorMessage: "Invalid URL - failed to decode message",
    });
  }
  res.locals.data = Base64.toUint8Array(res.locals.b64data);
  next();
};

const encodeData = (req, res, next) => {
  res.locals.b64data = Base64.fromUint8Array(res.locals.data, true);
  next();
};

const compressData = (req, res, next) => {
  res.locals.data = compressor.compress(res.locals.rawText);
  //res.locals.data = pako.deflate(res.locals.rawText);
  next();
};

const decompressData = (req, res, next) => {
  try {
    const rawText = compressor.decompress(res.locals.data);
    //const rawText = pako.inflate(res.locals.data, { to: 'string' });
    if (typeof rawText !== "string") {
      throw Error("pako.inflate returned a non-string");
    }
    res.locals.rawText = rawText;
    next();
  }
  catch (err) {
    next({
      statusCode: 400,
      clientErrorMessage: "Invalid URL - failed to decompress message data",
      origin: err,
    });
  }
};

const formUrls = (req, res, next) => {
  res.locals.urls = {
    qrLink: `${PREFIX}/${res.locals.b64data}`,
    page: `/${res.locals.b64data}`,
    img: `/i/${res.locals.b64data}.svg`,
    zoom: `/zoom/${res.locals.b64data}`,
  };
  next();
};

const extractData = (req, res, next) => {
  res.locals.b64data = req.params.data;
  next();
};

const extractText = (req, res, next) => {
  res.locals.rawText = req.body.text;
  next();
};

const renderMarkdown = (req, res, next) => {
  res.locals.formattedText = md.render(res.locals.rawText);
  next();
};

const setAboutText = (req, res, next) => {
  fs.promises.readFile(path.resolve(__dirname, './data/about.md'), { encoding: "utf-8" })
    .then(text => {
      res.locals.rawText = text;
      next();
    })
    .catch(err => next(err));
};

const setNewText = (req, res, next) => {
  res.locals.rawText = "";
  next();
};

const createQRCode = ((req, res, next) => {
  QRCode.toString(res.locals.urls.qrLink, { type: "svg" })
    .then(qr => {
      res.locals.qr = qr;
      next();
    })
    .catch(err => next({
      statusCode: 400,
      clientErrorMessage: "Message too large to fit in a QR code",
    }))
});

module.exports = {
  decodeData,
  decompressData,
  encodeData,
  compressData,
  formUrls,
  extractData,
  extractText,
  renderMarkdown,
  setAboutText,
  setNewText,
  createQRCode,
};
