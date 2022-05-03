const fs = require('fs');
const path = require('path');
const pako = require('pako');
const md = require('markdown-it')();
const QRCode = require('qrcode');
const { Base64 } = require('js-base64');

const { PREFIX } = require('./constants.js');

const decodeData = (req, res, next) => {
  if (!Base64.isValid(res.locals.b64data)) {
    console.log(res.locals);
    next('Invalid param');
  }
  res.locals.data = Base64.toUint8Array(res.locals.b64data);
  next();
};

const encodeData = (req, res, next) => {
  res.locals.b64data = Base64.fromUint8Array(res.locals.data, true);
  next();
};

const compressData = (req, res, next) => {
  res.locals.data = pako.deflate(res.locals.rawText);
  next();
};

const decompressData = (req, res, next) => {
  try {
    res.locals.rawText = pako.inflate(res.locals.data, { to: 'string' });
    next();
  }
  catch (err) {
    next(err);
  }
};

const formUrl = (req, res, next) => {
  res.locals.url = `${PREFIX}/${res.locals.b64data}`;
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
  fs.promises.readFile(path.resolve(__dirname, './static/about.md'))
    .then(text => {
      res.locals.rawText = text;
      next();
    })
    .catch(err => next(err));
};

const createQRCode = ((req, res, next) => {
  QRCode.toDataURL(res.locals.url)
    .then(qr => {
      res.locals.qr = qr;
      next();
    })
    .catch(err => next(err))
});

module.exports = {
  decodeData,
  decompressData,
  encodeData,
  compressData,
  formUrl,
  extractData,
  extractText,
  renderMarkdown,
  setAboutText,
  createQRCode,
};
