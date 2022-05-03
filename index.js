const path = require("path");
const express = require("express");
const process = require("process");

const {
  decodeData,
  decompressData,
  encodeData,
  compressData,
  extractData,
  formUrls,
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
  formUrls,
  (req, res) => {
    res.redirect(res.locals.urls.page)
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
  formUrls,
  (req, res) => {
    res.redirect(res.locals.urls.page);
  }
);

app.get("/i/:data.svg",
  extractData,
  formUrls,
  createQRCode,
  (req, res) => {
    res.set("Content-Type", "image/svg+xml");
    res.send(res.locals.qr);
  }
);

app.get("/zoom/:data",
  extractData,
  formUrls,
  (req, res) => {
    const { urls } = res.locals;
    res.render("zoom", { urls });
  }
)

app.get("/:data",
  extractData,
  decodeData,
  decompressData,
  renderMarkdown,
  formUrls,
  (req, res) => {
    const { qr, rawText, formattedText, urls } = res.locals;
    res.render('mirror', { qr, rawText, formattedText, urls });
  }
);

app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(500);
});

app.listen(PORT, () => { console.log("Listening") });
