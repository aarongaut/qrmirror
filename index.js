const path = require("path");
const express = require("express");
const process = require("process");

const {
  compressData,
  createQRCode,
  decodeData,
  decompressData,
  encodeData,
  extractData,
  extractText,
  formUrls,
  renderMarkdown,
  setAboutText,
  setNewText,
} = require("./controller.js");
const { PORT } = require("./constants.js");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.get("/",
  setNewText,
  compressData,
  encodeData,
  renderMarkdown,
  formUrls,
  (req, res) => {
    const { rawText, formattedText, urls } = res.locals;
    res.render('mirror', { rawText, formattedText, urls });
  }
);


app.get("/about",
  setAboutText,
  compressData,
  encodeData,
  renderMarkdown,
  formUrls,
  (req, res) => {
    const { rawText, formattedText, urls } = res.locals;
    res.render('mirror', { rawText, formattedText, urls });
  }
);

app.get("/style.css", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./static/style.css"));
});

app.get("/script.js", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./static/script.js"));
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
    const { rawText, formattedText, urls } = res.locals;
    res.render('mirror', { rawText, formattedText, urls });
  }
);

app.use((req, res, next) => {
  next({
    clientErrorMessage: "Not found",
    statusCode: 404,
  });
});

app.use((err, req, res, next) => {
  if (err.type === "entity.too.large") {
    err = {
      clientErrorMessage: "Message too large",
      statusCode: 413,
      origin: err,
    };
  }

  const defaultClientError = {
    clientErrorMessage: "Unknown error",
    statusCode: 500,
  };
  const { clientErrorMessage, statusCode } = Object.assign(defaultClientError, err);

  if (statusCode >= 500) {
    console.error("ERROR: ", err);
  }

  res.status(statusCode).render("error", { statusCode, clientErrorMessage });
});

app.listen(PORT, () => { console.log("Listening") });
