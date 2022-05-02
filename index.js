const path = require("path");
const express = require("express");
const process = require("process");

const { decodeData, decompressData, encodeData, compressData, extractData, formUrl, extractText } = require("./controllers/compression.js");
const { createQRCode } = require("./controllers/qr.js");

const app = express();
const PORT = 8000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./static/index.html"))
});

app.post("/api/mirror/",
  extractText,
  compressData,
  encodeData,
  formUrl,
  (req, res) => {
    res.redirect(res.locals.url)
  }
);

app.get("/:data",
  extractData,
  decodeData,
  decompressData,
  formUrl,
  createQRCode,
  (req, res) => {
    const { qr, text } = res.locals;
    res.render('mirror', { qr, text })
  }
);

app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(500);
});

app.listen(8000, () => { console.log("Listening") });
