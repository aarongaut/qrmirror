const path = require("path");
const express = require("express");
const process = require("process");

const {
  decodeData,
  decompressData,
  encodeData,
  compressData,
  extractData,
  formUrl,
  extractText,
  renderMarkdown,
  setAboutText,
  createQRCode,
} = require("./controller.js");
const { PORT } = require("./constants.js");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.get("/",
  setAboutText,
  compressData,
  encodeData,
  formUrl,
  (req, res) => {
    res.redirect(res.locals.url)
  }
);

app.get("/style.css", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./static/style.css"));
});

app.get("/favicon.ico", (req, res) => {
  res.sendStatus(404);
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
  renderMarkdown,
  formUrl,
  createQRCode,
  (req, res) => {
    const { qr, rawText, formattedText } = res.locals;
    res.render('mirror', { qr, rawText, formattedText })
  }
);

app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(500);
});

app.listen(PORT, () => { console.log("Listening") });
