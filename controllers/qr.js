const QRCode = require('qrcode');

const createQRCode = ((req, res, next) => {
  QRCode.toDataURL(res.locals.url)
    .then(qr => {
      res.locals.qr = qr;
      next();
    })
    .catch(err => next(err))
});

module.exports = { createQRCode };
