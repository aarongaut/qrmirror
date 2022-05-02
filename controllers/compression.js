const pako = require('pako');
const { Base64 } = require('js-base64');

const { DOMAIN } = require('../constants.js');

const decodeData = (req, res, next) => {
  if (!Base64.isValid(res.locals.b64data)) {
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
  res.locals.data = pako.deflate(res.locals.text);
  next();
};

const decompressData = (req, res, next) => {
  try {
    res.locals.text = pako.inflate(res.locals.data, { to: 'string' });
    next();
  }
  catch (err) {
    next(err);
  }
};

const formUrl = (req, res, next) => {
  res.locals.url = `${DOMAIN}/${res.locals.b64data}`;
  next();
};

const extractData = (req, res, next) => {
  res.locals.b64data = req.params.data;
  next();
};

const extractText = (req, res, next) => {
  res.locals.text = req.body.text;
  next();
};

module.exports = {
  decodeData,
  decompressData,
  encodeData,
  compressData,
  formUrl,
  extractData,
  extractText,
};
